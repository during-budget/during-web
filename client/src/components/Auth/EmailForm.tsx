import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router';
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
import GuestLoginButton from './GuestLoginButton';

interface EmailFormProps {
  changeAuthType: () => void;
  onLogin: (user: UserDataType, to: string) => void;
}

const EmailForm = ({ changeAuthType, onLogin }: EmailFormProps) => {
  const dispatch = useAppDispatch();
  const location = useLocation();

  const from = location.state?.from?.pathname;

  const codeRef = useRef<any>(null);
  const persistRef = useRef<HTMLInputElement>(null);

  const [emailState, setEmailState] = useState('');
  const [emailVerifyState, setEmailVerifyState] = useState(false);
  const [errorState, setErrorState] = useState<String[]>([]);
  const [isLogin, setIsLogin] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

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

    setIsDisabled(true);

    try {
      if (isLogin) {
        await sendCodeLogin(emailState);
      } else {
        await sendCodeRegister(emailState);
      }

      setEmailVerifyState(true);
    } catch (error) {
      setIsDisabled(false);
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
      const persist = persistRef.current!.checked;

      if (isLogin) {
        data = await verifyLogin(emailState, code, persist);
        onLogin(data.user, from || '/budget');
      } else {
        data = await verifyRegister(emailState, code, persist);
        onLogin(data.user, '/init');
      }
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

  const focusEmail = () => {
    const emailInput = document.getElementById('auth-email-input') as HTMLInputElement;
    emailInput?.focus({ preventScroll: true });
  };

  // Focus email input on First load
  useEffect(() => {
    if (!isDisabled) {
      focusEmail();
    }
  }, [emailVerifyState, isLogin, isDisabled]);

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
      <img src="/images/logo.png" alt="듀링 가계부 로고" />
      <h2>{isLogin ? '로그인' : '회원가입'}</h2>
      <form className={classes.form}>
        <InputField
          id="auth-email-field"
          className={`${classes.field} ${classes.emailField}`}
        >
          <div className={classes.emailLabel}>
            <label htmlFor="auth-email-input">
              이메일로 {isLogin ? '로그인' : '회원가입'}
            </label>
            {emailVerifyState && (
              <Button sizeClass="sm" onClick={sendHandler}>
                재전송
              </Button>
            )}
          </div>

          <input
            id="auth-email-input"
            type="email"
            value={emailState}
            onChange={emailHandler}
            disabled={isDisabled}
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
            <div className={classes.options}>
              <div className={classes.persist}>
                <input
                  id="auth-email-persist"
                  ref={persistRef}
                  type="checkbox"
                  defaultChecked={true}
                />
                <label htmlFor="auth-email-persist">자동 로그인</label>
              </div>
              <Button
                styleClass="extra"
                className={classes.restart}
                onClick={async () => {
                  setEmailState('');
                  setIsDisabled(false);
                  setEmailVerifyState(false);
                }}
              >
                <u>이메일 다시 입력하기</u>
              </Button>
            </div>
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
        <GuestLoginButton onLogin={onLogin} />
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
        SNS로 시작하기
      </Button>
    </div>
  );
};

export default EmailForm;
