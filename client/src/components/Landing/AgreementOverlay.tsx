import * as Sentry from '@sentry/browser';
import { useState } from 'react';
import { ActionFunctionArgs, redirect, useNavigate, useSubmit } from 'react-router-dom';
import { privacyPolicyVersion, termsOfUseVersion } from '../../constants/version';
import { useAppDispatch } from '../../hooks/useRedux';
import { uiActions } from '../../store/ui';
import { userActions } from '../../store/user';
import { fetchRequest } from '../../util/request';
import OverlayForm from '../UI/overlay/OverlayForm';
import Privacy from '../User/Info/Privacy';
import Terms from '../User/Info/Terms';

interface AgreementOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  isInit: boolean;
}

const AgreementOverlay = ({ isOpen, onClose, isInit }: AgreementOverlayProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [termsAgree, setTermsAgree] = useState(false);
  const [privacyAgree, setPrivacyAgree] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const submitHandler = async () => {
    try {
      await fetchRequest({
        url: '/users/agreement',
        method: 'put',
        body: {
          termsOfUse: termsOfUseVersion,
          privacyPolicy: privacyPolicyVersion,
        },
      });
      onClose();
    } catch (error) {
      onClose();
    }
  };

  const goBackHandler = async () => {
    // delete user
    Sentry.setUser(null);
    try {
      isInit && await fetchRequest({ url: '/users', method: 'delete' });
      dispatch(userActions.logout());
      navigate(-1);
    } catch (error) {
      dispatch(
        uiActions.showErrorModal({
          description: '초기 화면으로 이동 중 문제가 발생했습니다.',
        })
      );
      throw error;
    }
  };

  const termsClickHandler = () => {
    if (termsAgree) {
      setTermsAgree(false);
    } else {
      setShowTerms(true);
    }
  };

  const privacyClickHandler = () => {
    if (privacyAgree) {
      setPrivacyAgree(false);
    } else {
      setShowPrivacy(true);
    }
  };

  const termsAgreeHandler = () => {
    setTermsAgree(true);
  };

  const privacyAgreeHandler = () => {
    setPrivacyAgree(true);
  };

  const termsCloseHandler = () => {
    setShowTerms(false);
  };

  const privacyCloseHandler = () => {
    setShowPrivacy(false);
  };

  return (
    <>
      <OverlayForm
        overlayOptions={{
          id: 'agreement',
          isOpen,
          onClose: goBackHandler,
          disableBackdrop: true,
        }}
        onSubmit={submitHandler}
        confirmCancelOptions={{
          closeMsg: '처음으로',
          confirmMsg: '동의하기',
          disabled: !(termsAgree && privacyAgree),
        }}
      >
        <ul className="p-1 flex-column gap-md">
          <li className="flex j-between i-center" onClick={termsClickHandler}>
            <div className="flex gap-md text-xl extra-bold">
              <span className={termsAgree ? undefined : 'o-0.2 extra-heavy'}>✓</span>
              <span>이용약관</span>
            </div>
            <u className="text-ml">전문보기</u>
          </li>
          <li className="flex j-between i-center" onClick={privacyClickHandler}>
            <div className="flex gap-md text-xl extra-bold">
              <span className={privacyAgree ? undefined : 'o-0.2 extra-heavy'}>✓</span>
              <span>개인정보처리방침</span>
            </div>
            <u className="text-ml">전문보기</u>
          </li>
        </ul>
      </OverlayForm>
      <Terms isOpen={showTerms} onClose={termsCloseHandler} agree={termsAgreeHandler} />
      <Privacy
        isOpen={showPrivacy}
        onClose={privacyCloseHandler}
        agree={privacyAgreeHandler}
      />
    </>
  );
};

export default AgreementOverlay;
