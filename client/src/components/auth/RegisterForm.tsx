import classes from './AuthForm.module.css';
import registerClasses from './RegisterForm.module.css';
import { useEffect, useState } from 'react';
import InputField from '../UI/InputField';
import Button from '../UI/Button';
import CodeField from './CodeField';

function LoginForm() {
    const [emailState, setEmailState] = useState('');
    const [emailCheckState, setEmailCheckState] = useState(false);
    const [passwordState, setPasswordState] = useState('');
    const [passwordCheckState, setPasswordCheckState] = useState('');

    useEffect(() => {
        const emailInput: HTMLInputElement | null =
            document.querySelector('#register-email');
        emailInput?.focus();
    }, []);

    const emailHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmailState(event.target.value);
    };

    const passwordHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordState(event.target.value);
    };

    const passwordCheckHandler = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setPasswordCheckState(event.target.value);
    };

    return (
        <form className={classes.form}>
            {/* E-mail */}
            <InputField
                id="register-email-field"
                className={`${classes.field} ${registerClasses.emailField}`}
                isFloatLabel={false}
            >
                <input
                    id="register-email"
                    type="email"
                    value={emailState}
                    placeholder="이메일을 입력하세요"
                    onChange={emailHandler}
                    required
                />
                <p className={registerClasses.emailLabel}>
                    <label htmlFor="register-email">이메일</label>
                    <Button
                        sizeClass="sm"
                        onClick={() => {
                            setEmailCheckState(true);
                            // TODO: focus to CodeField
                        }}
                    >
                        인증하기
                    </Button>
                </p>
            </InputField>
            {emailCheckState && <CodeField />}

            {/* Password */}
            <InputField
                id="register-password-field"
                className={`${classes.field} ${registerClasses.passwordField}`}
                isFloatLabel={false}
            >
                <input
                    id="register-password-check"
                    type="password"
                    value={passwordState}
                    placeholder="비밀번호를 다시 입력하세요"
                    onChange={passwordHandler}
                    required
                />
                <input
                    id="register-password"
                    type="password"
                    value={passwordCheckState}
                    placeholder="비밀번호를 입력하세요"
                    onChange={passwordCheckHandler}
                    required
                />
                <label htmlFor="register-email">비밀번호</label>
            </InputField>
            <Button type="submit" className={classes.submit}>
                회원가입
            </Button>
        </form>
    );
}

export default LoginForm;
