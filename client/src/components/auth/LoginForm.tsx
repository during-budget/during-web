import { useEffect, useState } from 'react';
import classes from './AuthForm.module.css';
import InputField from '../UI/InputField';
import Button from '../UI/Button';

function LoginForm(props: {
    loginHandler: (email: string, password: string, reset: () => void) => void;
}) {
    const [emailState, setEmailState] = useState('');
    const [passwordState, setPasswordState] = useState('');

    useEffect(() => {
        const emailInput: HTMLInputElement | null =
            document.querySelector('#login-email');
        emailInput?.focus();
    }, []);

    const emailHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmailState(event.target.value);
    };

    const passwordHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordState(event.target.value);
    };

    const submitHandler = (event: React.FormEvent) => {
        event.preventDefault();
        props.loginHandler(emailState, passwordState, resetInput);
    };

    const resetInput = () => {
        setEmailState('');
        setPasswordState('');
    };

    return (
        <form className={classes.form} onSubmit={submitHandler}>
            <InputField
                id="login-email-field"
                className={classes.field}
                isFloatLabel={true}
            >
                <input
                    id="login-email"
                    type="email"
                    value={emailState}
                    onChange={emailHandler}
                    required
                />
                <label htmlFor="login-email">이메일</label>
            </InputField>
            <InputField
                id="login-email-field"
                className={classes.field}
                isFloatLabel={true}
            >
                <input
                    id="login-password"
                    type="password"
                    value={passwordState}
                    onChange={passwordHandler}
                    required
                />
                <label htmlFor="login-password">비밀번호</label>
            </InputField>
            <Button type="submit" className={classes.submit}>
                로그인
            </Button>
        </form>
    );
}

export default LoginForm;
