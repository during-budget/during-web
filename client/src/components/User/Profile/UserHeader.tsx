import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux';
import Channel from '../../../models/Channel';
import { uiActions } from '../../../store/ui';
import { userActions } from '../../../store/user';
import { updateUserInfo } from '../../../util/api/userAPI';
import { getErrorMessage } from '../../../util/error';
import Button from '../../UI/button/Button';
import Mask from '../../UI/component/Mask';
import InputField from '../../UI/input/InputField';
import OverlayForm from '../../UI/overlay/OverlayForm';
import classes from './UserHeader.module.css';

interface UserHeaderProps {
  isGuest?: boolean;
  img?: string;
  svg?: string;
  openAuth: () => void;
}

function UserHeader({ isGuest, img, svg, openAuth }: UserHeaderProps) {
  const dispatch = useAppDispatch();

  const [showInfoForm, setShowInfoForm] = useState(false);

  const { email, userName, birthdate, tel, gender } = useAppSelector(
    (state) => state.user.info
  );

  const [userNameState, setUserNameState] = useState(userName);
  const [birthdateState, setBirthdateState] = useState(birthdate);
  const [telState, setTelState] = useState(tel);
  const [genderState, setGenderState] = useState(gender);

  const closeInfoForm = () => {
    setShowInfoForm(false);
    Channel.showChannelButton();
  };

  const submitHandler = async () => {
    try {
      const { userName, birthdate, tel, gender } = await updateUserInfo({
        userName: userNameState,
        birthdate: birthdateState,
        tel: telState,
        gender: genderState,
      });

      dispatch(userActions.updateUserInfo({ userName, birthdate, tel, gender }));
      closeInfoForm();
    } catch (error) {
      const message = getErrorMessage(error);
      if (message) {
        dispatch(uiActions.showModal({ title: message }));
      } else {
        dispatch(
          uiActions.showErrorModal({
            description: '회원 정보 업데이트 중 문제가 발생했습니다.',
          })
        );
        throw error;
      }
    }
  };

  const guestHeader = (
    <div className={classes.guest}>
      <h3>둘러보는 중이에요</h3>
      <Button onClick={openAuth} className="my-0.75">
        계정 등록 진행하기
      </Button>
      <p className="text-md">
        ⚠️ 탈퇴 및 세션 만료 등으로 인해 접속이 중단될 시<br />
        <strong>
          <u>계정 데이터를 복구할 수 없습니다.</u>
        </strong>
      </p>
    </div>
  );

  useEffect(() => {
    setUserNameState(userName);
    setTelState(tel);
    setBirthdateState(birthdate);
    setGenderState(gender);
  }, [showInfoForm]);

  return (
    <header className={classes.userHeader}>
      <div
        className={classes.profile}
        style={{
          backgroundImage: `url("${img || ''}")`,
          backgroundSize: 'cover',
        }}
      >
        {svg && <Mask className={classes.primary} mask={svg} />}
        {/* <input type="file" accept="image/*"></input> */}
      </div>
      {isGuest ? (
        guestHeader
      ) : (
        <>
          <h1>{isGuest ? '둘러보는 중이에요' : userName}</h1>
          <h5>{isGuest ? userName : email}</h5>
        </>
      )}
      {!isGuest && (
        <Button
          styleClass="gray"
          className={classes.edit}
          onClick={() => {
            setShowInfoForm(true);
            Channel.hideChannelButton();
          }}
        >
          회원 정보 수정하기
        </Button>
      )}
      <OverlayForm
        className={classes.infoForm}
        overlayOptions={{
          id: 'user-header',
          isOpen: showInfoForm,
          onClose: closeInfoForm,
        }}
        onSubmit={submitHandler}
      >
        <h3>회원 정보 수정</h3>
        <div className={classes.fields}>
          <InputField id="user-name">
            <label>이름</label>
            <input
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setUserNameState(event.target.value);
              }}
              value={userNameState}
              placeholder="이름을 입력해주세요."
            />
          </InputField>
          <InputField id="tel">
            <label>휴대폰번호</label>
            <input
              type="text"
              pattern="\d[0-9]{2,3}-[0-9]{3,4}-[0-9]{3,4}"
              maxLength={13}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                const entertedValue = event.target.value;
                const convertedValue = entertedValue
                  .replace(/[^0-9]/g, '')
                  .replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, '$1-$2-$3')
                  .replace(/(\-{1,2})$/g, '');
                setTelState(convertedValue);
              }}
              value={telState}
            />
          </InputField>
          <InputField id="birthdate">
            <label>생일</label>
            <input
              type="date"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setBirthdateState(event.target.value);
              }}
              value={birthdateState ? dayjs(birthdateState).format('YYYY-MM-DD') : ''}
            />
          </InputField>
          <InputField id="gender">
            <label>성별</label>
            <input
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setGenderState(event.target.value);
              }}
              value={genderState}
            />
          </InputField>
        </div>
      </OverlayForm>
    </header>
  );
}

export default UserHeader;
