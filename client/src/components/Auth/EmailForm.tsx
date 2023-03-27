import { useRef, useState } from 'react';
import classes from './EmailForm.module.css';
import logo from '../../assets/png/logo.png';
import InputField from '../UI/InputField';
import Button from '../UI/Button';
import CodeField from '../Authh/CodeField';
import { throwError } from '../../util/error';

function EmailForm(props: {
    isLogin: boolean;
    toggleIsLogin: () => void;
    changeAuthType: () => void;
}) {
    const { isLogin, toggleIsLogin } = props;

    const [emailState, setEmailState] = useState('');
    const [emailVerifyState, setEmailVerifyState] = useState(false);
    const codeRef = useRef<any>();

    let verifyingEmail = '';

    // Handlers
    const sendHandler = async (event?: React.MouseEvent) => {
        event!.preventDefault();

        try {
            // await sendCodeLogin(emailState);
            verifyingEmail = emailState;
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
            console.log(code);

            // TODO: 자동로그인(persist) 체크박스 추가
            // data = await verifyLogin(verifyingEmail, code, true);
            // props.setUserData(data.user);

            setEmailVerifyState(false);
        } catch (error) {
            throwError(error);
        }
    };

    const emailHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmailState(event.target.value);
    };

    return (
        <div className={classes.container}>
            <img src={logo} alt="듀링 가계부 로고" />
            <h2>{isLogin ? '로그인' : '회원가입'}</h2>
            <form className={classes.form}>
                <InputField
                    id="auth-email-field"
                    className={classes.field}
                    isFloatLabel={true}
                >
                    <input
                        id="auth-email"
                        type="email"
                        value={emailState}
                        onChange={emailHandler}
                        required
                    />
                    <label htmlFor="auth-email">이메일</label>
                </InputField>
                {!emailVerifyState && (
                    <Button
                        type="submit"
                        className={classes.submit}
                        onClick={sendHandler}
                    >
                        인증코드 전송
                    </Button>
                )}
                {emailVerifyState && (
                    <CodeField className={classes.code} ref={codeRef} />
                )}
                {emailVerifyState && (
                    <Button
                        type="submit"
                        className={classes.submit}
                        onClick={verifyHandler}
                    >
                        로그인하기
                    </Button>
                )}
            </form>
            <div className={classes.buttons}>
                <Button
                    styleClass="extra"
                    onClick={() => {
                        toggleIsLogin();
                    }}
                >
                    {isLogin ? '회원가입' : '로그인'}
                </Button>
                |{' '}
                <Button styleClass="extra" onClick={props.changeAuthType}>
                    {isLogin ? 'SNS로 로그인' : 'SNS로 회원가입'}
                </Button>
            </div>
        </div>
    );
}

export default EmailForm;
