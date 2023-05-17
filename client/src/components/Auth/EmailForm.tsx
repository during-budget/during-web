import { useEffect, useRef, useState } from 'react';
import {
  sendCodeLogin,
  sendCodeRegister,
  verifyLogin,
  verifyRegister,
} from '../../util/api/userAPI';
import { throwError } from '../../util/error';
import CodeField from '../Auth/CodeField';
import Button from '../UI/Button';
import InputField from '../UI/InputField';
import classes from './EmailForm.module.css';

function EmailForm(props: {
  isLogin: boolean;
  toggleIsLogin: () => void;
  changeAuthType: () => void;
  getUserLogin: (user: any) => void;
}) {
  const { isLogin, toggleIsLogin } = props;

  const [emailState, setEmailState] = useState('');
  const [emailVerifyState, setEmailVerifyState] = useState(false);
  const codeRef = useRef<any>();

  // Handlers
  const sendHandler = async (event?: React.MouseEvent) => {
    event!.preventDefault();

    try {
      if (isLogin) {
        await sendCodeLogin(emailState);
      } else {
        await sendCodeRegister(emailState);
      }

      setEmailVerifyState(true);
    } catch (error) {
      throwError(error);
    }
  };

  const verifyHandler = async (event?: React.MouseEvent) => {
    event!.preventDefault();

    let data;
    try {
      const code = codeRef.current!.value();

      // TODO: 자동로그인(persist) 체크박스 추가
      const persist = true;

      if (isLogin) {
        data = await verifyLogin(emailState, code, persist);
      } else {
        data = await verifyRegister(emailState, code, persist);
      }

      props.getUserLogin(data.user);
    } catch (error) {
      throwError(error);
    }
  };

  const emailHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmailState(event.target.value);
  };

  useEffect(() => {
    const field = document.querySelector('#auth-email-field input') as HTMLInputElement;
    field?.focus();
  }, []);

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
            <Button type="submit" className={classes.submit} onClick={verifyHandler}>
              {isLogin ? '로그인' : '회원가입'}
            </Button>
          </>
        ) : (
          <Button type="submit" className={classes.submit} onClick={sendHandler}>
            {isLogin ? '로그인 인증코드 전송' : '회원가입 인증코드 전송'}
          </Button>
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
            toggleIsLogin();
          }}
        >
          {isLogin ? '회원가입하기' : '로그인하기'}
        </Button>
      </div>
      <Button styleClass="extra" className={classes.sns} onClick={props.changeAuthType}>
        SNS로 {isLogin ? '로그인' : '회원가입'}
      </Button>
    </div>
  );
}

export default EmailForm;
