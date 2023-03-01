import classes from './AuthForm.module.css';
import InputField from '../UI/InputField';
import { useState } from 'react';
import Button from '../UI/Button';

function LoginForm() {
    const [emailState, setEmailState] = useState('');
    const [passwordState, setPasswordState] = useState('');

    const emailHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmailState(event.target.value);
    };

    const passwordHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordState(event.target.value);
    };

    return (
        <form className={classes.form}>
            <InputField className={classes.field} isFloatLabel={true}>
                <input
                    id="auth-email"
                    type="email"
                    value={emailState}
                    onChange={emailHandler}
                    required
                />
                <label htmlFor="auth-email">이메일</label>
            </InputField>
            <InputField className={classes.field} isFloatLabel={true}>
                <input
                    id="auth-password"
                    type="password"
                    value={passwordState}
                    onChange={passwordHandler}
                    required
                />
                <label htmlFor="auth-email">비밀번호</label>
            </InputField>
            <Button type="submit" className={classes.submit}>로그인</Button>
        </form>
    );
}

export default LoginForm;