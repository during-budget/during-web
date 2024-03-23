import { css } from '@emotion/react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { useToggle } from '../../hooks/useToggle';
import { uiActions } from '../../store/ui';
import { guestLogin } from '../../util/api/authAPI';
import Button from '../UI/button/Button';
import Overlay from '../UI/overlay/Overlay';
import EmailForm from './EmailForm';
import SNSButtons from './SNSButtons';

interface AuthProps {
  isOpen: boolean;
  onClose: () => void;
  hideGuest?: boolean;
  showEmail?: boolean;
}

function AuthOverlay({ isOpen, onClose, hideGuest, showEmail }: AuthProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const platform = useAppSelector((state) => state.ui.platform);

  const [isSns, setSnsAuth, setEmailAuth] = useToggle(true);

  useEffect(() => {
    if (isOpen && showEmail) {
      setEmailAuth();
    } else if (isOpen) {
      setSnsAuth();
    }
  }, [isOpen]);

  const guestHandler = async () => {
    try {
      const data = await guestLogin();
      if (data.user) {
        navigate('/budget/init#base');
      } else {
        throw new Error('계정을 생성하지 못했습니다.');
      }
    } catch (error) {
      const message = (error as Error).message;
      dispatch(uiActions.showErrorModal({ description: message }));
      throw new Error(message);
    }
  };

  return (
    <>
      <Overlay
        id="auth"
        css={css({
          maxWidth: 480,
          height: '95vh',
          transform:
            isSns && isOpen ? 'translateY(40%) translateZ(0) !important' : undefined,
          '@media screen and (min-width: 840px)': {
            transform: 'translate(0, 100%) translateZ(0)',
          },
        })}
        isOpen={isOpen}
        onClose={onClose}
        isCenter={true}
      >
        <header className="flex-column i-center" css={css({ marginTop: '8vh' })}>
          <img
            src="/images/logo.png"
            alt="듀링 가계부 로고"
            css={css({
              width: '6vh',
              marginBottom: '0.5vh',
            })}
          />
          <h2>시작하기</h2>
          {isSns && <p>SNS 계정으로 시작</p>}
        </header>
        {isSns ? <SNSButtons isWebview={!!platform} /> : <EmailForm />}
        <div className="w-80 mx-auto flex-center">
          <Button styleClass="extra" onClick={guestHandler}>
            가입 없이 둘러보기
          </Button>
          <span>|</span>
          <Button styleClass="extra" onClick={isSns ? setEmailAuth : setSnsAuth}>
            {isSns ? '이메일로 시작하기' : 'SNS로 시작하기'}
          </Button>
        </div>
      </Overlay>
    </>
  );
}

export default AuthOverlay;
