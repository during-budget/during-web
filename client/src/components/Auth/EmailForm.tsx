import { useEffect, useRef, useState } from 'react';
import { useAppDispatch } from '../../hooks/redux-hook';
import { uiActions } from '../../store/ui';
import {
  UserDataType,
  sendCodeLogin,
  sendCodeRegister,
  verifyLogin,
  verifyRegister,
} from '../../util/api/userAPI';
import { getErrorMsg } from '../../util/error';
import { validateEmail } from '../../util/validate';
import CodeField from '../Auth/CodeField';
import Button from '../UI/Button';
import Inform from '../UI/Inform';
import InputField from '../UI/InputField';
import classes from './EmailForm.module.css';

interface EmailFormProps {
  changeAuthType: () => void;
  getUserLogin: (user: UserDataType) => void;
}

const EmailForm = ({ changeAuthType, getUserLogin }: EmailFormProps) => {
  const dispatch = useAppDispatch();

  const codeRef = useRef<any>();

  const [emailState, setEmailState] = useState('');
  const [emailVerifyState, setEmailVerifyState] = useState(false);
  const [errorState, setErrorState] = useState<String[]>([]);
  const [isLogin, setIsLogin] = useState(false);

  // Handlers
  const sendHandler = async (event?: React.MouseEvent) => {
    event!.preventDefault();
    setErrorState([]);

    if (!emailState.trim()) {
      setErrorState(['이메일을 입력하세요']);
      return;
    }

    if (!validateEmail(emailState)) {
      setErrorState(['올바른 이메일을 입력해주세요']);
      return;
    }

    try {
      if (isLogin) {
        await sendCodeLogin(emailState);
      } else {
        await sendCodeRegister(emailState);
      }

      setEmailVerifyState(true);
    } catch (error) {
      const msg = getErrorMsg(error);
      if (msg) {
        setErrorState(msg);
      } else {
        dispatch(uiActions.showErrorModal());
      }
    }
  };

  const verifyHandler = async (event?: React.MouseEvent) => {
    event!.preventDefault();
    setErrorState([]);

    if (!emailState.trim()) {
      setErrorState(['이메일을 입력하세요']);
      return;
    }

    const code = codeRef.current!.value();
    if (code.trim().length < 6) {
      setErrorState(['인증 코드 여섯자리를 모두 입력하세요']);
      return;
    }

    let data;
    try {
      // TODO: 자동로그인(persist) 체크박스 추가
      const persist = true;

      if (isLogin) {
        data = await verifyLogin(emailState, code, persist);
      } else {
        data = await verifyRegister(emailState, code, persist);
      }

      getUserLogin(data.user);
    } catch (error) {
      const msg = getErrorMsg(error);
      if (!msg) {
        dispatch(uiActions.showErrorModal());
      } else {
        setErrorState(msg);
      }
    }
  };

  const emailHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmailState(event.target.value);
  };

  const toggleIsLogin = () => {
    setErrorState([]);
    setIsLogin((prev) => !prev);
  };

  // Focus email input on First load
  useEffect(() => {
    const field = document.querySelector('#auth-email-field input') as HTMLInputElement;
    field?.focus();
  }, []);

  // Error message JSXElement
  const errorMessage = errorState.length !== 0 && (
    <Inform isError={true} className={classes.error} isFlex={true} isLeft={true}>
      {errorState.map((error, i) => {
        return (
          <p key={i}>
            {errorState.length > 1 && i === 0 ? <strong>{error}</strong> : error}
          </p>
        );
      })}
    </Inform>
  );

  return (
    <div className={classes.email}>
      <img src="/assets/images/logo.png" alt="듀링 가계부 로고" />
      <h2>{isLogin ? '로그인' : '회원가입'}</h2>
      <form className={classes.form}>
        <InputField
          id="auth-email-field"
          className={`${classes.field} ${classes.emailField}`}
        >
          <div className={classes.emailLabel}>
            <label htmlFor="register-email">
              이메일로 {isLogin ? '로그인' : '회원가입'}
            </label>
            {emailVerifyState && (
              <Button sizeClass="sm" onClick={sendHandler}>
                재전송
              </Button>
            )}
          </div>

          <input
            id="auth-email"
            type="email"
            value={emailState}
            onChange={emailHandler}
            required
          />
        </InputField>

        {emailVerifyState ? (
          <>
            <CodeField className={classes.code} ref={codeRef} />
            {errorMessage}
            <Button type="submit" className={classes.submit} onClick={verifyHandler}>
              {isLogin ? '로그인' : '회원가입'}
            </Button>
          </>
        ) : (
          <>
            {errorMessage}
            <Button type="submit" className={classes.submit} onClick={sendHandler}>
              {isLogin ? '로그인 인증코드 전송' : '회원가입 인증코드 전송'}
            </Button>
          </>
        )}
      </form>
      <div className={classes.buttons}>
        <Button styleClass="extra" className={classes.guest}>
          가입 없이 둘러보기
        </Button>
        <span>|</span>
        <Button
          styleClass="extra"
          onClick={() => {
            setErrorState([]);
            toggleIsLogin();
          }}
        >
          {isLogin ? '회원가입하기' : '로그인하기'}
        </Button>
      </div>
      <Button
        styleClass="extra"
        className={classes.sns}
        onClick={() => {
          changeAuthType();
        }}
      >
        SNS로 {isLogin ? '로그인' : '회원가입'}
      </Button>
    </div>
  );
};

export default EmailForm;
