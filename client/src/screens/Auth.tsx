import { useState } from 'react';
import classes from './Auth.module.css';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import Button from '../components/UI/Button';

function Auth() {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const logo = require('../assets/png/logo.png');

    const loginActions = (
        <div className={classes.actions}>
            <Button styleClass="extra">둘러보기</Button> |{' '}
            <Button
                styleClass="extra"
                onClick={() => {
                    setIsLoginMode(false);
                }}
            >
                회원가입
            </Button>
        </div>
    );
    const registerActions = (
        <Button
            styleClass="extra"
            onClick={() => {
                setIsLoginMode(true);
            }}
        >
            로그인 화면으로 돌아가기
        </Button>
    );

    return (
        <div className={classes.auth}>
            <img
                src={logo}
                alt="듀링 가계부 로고"
                style={{ display: isLoginMode ? 'block' : 'none' }}
            />
            <h1>{isLoginMode ? '듀링 가계부' : '회원가입'}</h1>
            {isLoginMode ? <LoginForm /> : <RegisterForm />}
            {isLoginMode ? loginActions : registerActions}
        </div>
    );
}

export default Auth;
