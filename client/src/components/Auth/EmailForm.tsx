import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router';
import { useAppDispatch } from '../../hooks/useRedux';
import { uiActions } from '../../store/ui';
import { localAuth } from '../../util/api/authAPI';
import { getErrorMessage } from '../../util/error';
import { validateEmail } from '../../util/validate';
import CodeField from '../Auth/CodeField';
import Button from '../UI/Button';
import Inform from '../UI/Inform';
import InputField from '../UI/InputField';
import { AuthFormProps } from './AuthOverlay';

const EmailForm = ({ changeAuthType, onLogin, hideGuest }: AuthFormProps) => {
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
        onLogin(user, '/init');
      } else {
        onLogin(user, from || '/budget');
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
    <Inform
      isError={true}
      css={{ marginTop: '0.5vh', marginBottom: '2vh' }}
      isFlex={true}
      isLeft={true}
    >
      <p>{errorState}</p>
    </Inform>
  );

  return (
    <div className="flex-column i-center mx-3" css={{ marginTop: '8vh' }}>
      <form className="w-100">
        <InputField id="auth-email-field" className="mb-0.5">
          <div className="flex j-between i-center">
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
            <CodeField className="mb-1.25" ref={codeRef} />
            {errorMessage}
            <Button type="submit" onClick={verifyHandler} isPending={isPending}>
              인증하기
            </Button>
            <div className="flex j-between i-center mb-0.625 px-0.5">
              <div className="flex i-center shrink-0 gap-xs text-md">
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
                className="j-end"
                onClick={async () => {
                  setEmailState('');
                  setIsDisabled(false);
                  setIsVerify(false);
                }}
              >
                <u className="text-md regular">이메일 다시 입력하기</u>
              </Button>
            </div>
          </>
        ) : (
          <>
            {errorMessage}
            <Button type="submit" onClick={sendHandler} isPending={isPending}>
              인증코드 전송
            </Button>
          </>
        )}
      </form>
    </div>
  );
};

export default EmailForm;
