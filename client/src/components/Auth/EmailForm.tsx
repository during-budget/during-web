import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router';
import { useAppDispatch } from '../../hooks/redux-hook';
import { uiActions } from '../../store/ui';
import { localAuth } from '../../util/api/authAPI';
import { UserDataType } from '../../util/api/userAPI';
import { getErrorMessage } from '../../util/error';
import { validateEmail } from '../../util/validate';
import CodeField from '../Auth/CodeField';
import Button from '../UI/Button';
import Inform from '../UI/Inform';
import InputField from '../UI/InputField';
import classes from './EmailForm.module.css';
import GuestLoginButton from './GuestLoginButton';

interface EmailFormProps {
  changeAuthType: () => void;
  onLanding: (user: UserDataType, to: string) => void;
}

const EmailForm = ({ changeAuthType, onLanding }: EmailFormProps) => {
  const dispatch = useAppDispatch();
  const location = useLocation();

  const from = location.state?.from?.pathname;

  const codeRef = useRef<any>(null);
  const persistRef = useRef<HTMLInputElement>(null);

  const [emailState, setEmailState] = useState('');
  const [isVerify, setIsVerify] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [errorState, setErrorState] = useState<String>('');
  const [isDisabled, setIsDisabled] = useState(false);

  // Handlers
  const sendHandler = async (event?: React.MouseEvent) => {
    event!.preventDefault();
    setErrorState('');
    setIsPending(true);

    if (isVerify) {
      codeRef.current.clear();
      codeRef.current.focus();
    }

    if (!emailState.trim()) {
      setErrorState('이메일을 입력하세요');
      setIsPending(false);
      return;
    }

    if (!validateEmail(emailState)) {
      setErrorState('올바른 이메일을 입력해주세요');
      setIsPending(false);
      return;
    }

    setIsDisabled(true);

    try {
      setIsVerify(true);
      await localAuth(emailState);
      setIsPending(false);
    } catch (error) {
      setIsPending(false);
      setIsVerify(false);
      setIsDisabled(false);

      const message = getErrorMessage(error);
      if (message) {
        setErrorState(message);
      } else {
        dispatch(uiActions.showErrorModal());
        throw error;
      }
    }
  };

  const verifyHandler = async (event?: React.MouseEvent) => {
    event!.preventDefault();
    setErrorState('');
    setIsPending(true);

    if (!emailState.trim()) {
      setErrorState('이메일을 입력하세요');
      return;
    }

    const code = codeRef.current!.value();
    if (code.trim().length < 6) {
      setErrorState('인증 코드 여섯자리를 모두 입력하세요');
      return;
    }

    try {
      const persist = persistRef.current!.checked;
      const { message, user } = await localAuth(emailState, code, persist);
      if (message === 'REGISTER_SUCCESS') {
        onLanding(user, '/init');
      } else {
        onLanding(user, from || '/budget');
      }
    } catch (error) {
      setIsPending(false);
      const message = getErrorMessage(error);
      if (message) {
        setErrorState(message);
      } else {
        dispatch(uiActions.showErrorModal());
        throw error;
      }
    }
  };

  const emailHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmailState(event.target.value);
  };

  const focusEmail = () => {
    const emailInput = document.getElementById('auth-email-input') as HTMLInputElement;
    emailInput?.focus({ preventScroll: true });
  };

  // Focus email input on First load
  useEffect(() => {
    if (isVerify) {
      codeRef.current && codeRef.current.focus();
    } else if (!isDisabled) {
      focusEmail();
    }
  }, [isVerify, isDisabled]);

  // Error message JSXElement
  const errorMessage = errorState.length !== 0 && (
    <Inform isError={true} className={classes.error} isFlex={true} isLeft={true}>
      <p>{errorState}</p>
    </Inform>
  );

  return (
    <div className={classes.email}>
      <img src="/images/logo.png" alt="듀링 가계부 로고" />
      <h2>시작하기</h2>
      <form className={classes.form}>
        <InputField
          id="auth-email-field"
          className={`${classes.field} ${classes.emailField}`}
        >
          <div className={classes.emailLabel}>
            <label htmlFor="auth-email-input">이메일로 시작</label>
            {isVerify && (
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

        {isVerify ? (
          <>
            <CodeField className={classes.code} ref={codeRef} />
            {errorMessage}
            <Button
              type="submit"
              className={classes.submit}
              onClick={verifyHandler}
              isPending={isPending}
            >
              인증하기
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
                  setIsVerify(false);
                }}
              >
                <u>이메일 다시 입력하기</u>
              </Button>
            </div>
          </>
        ) : (
          <>
            {errorMessage}
            <Button
              type="submit"
              className={classes.submit}
              onClick={sendHandler}
              isPending={isPending}
            >
              인증코드 전송
            </Button>
          </>
        )}
      </form>
      <div className={classes.buttons}>
        <GuestLoginButton onLogin={onLanding} />
        <span>|</span>
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
    </div>
  );
};

export default EmailForm;
