import { useEffect, useState } from 'react';
import classes from './Auth.module.css';
import LoginForm from '../components/Auth/LoginForm';
import RegisterForm from '../components/Auth/RegisterForm';
import Button from '../components/UI/Button';
import { getUserState } from '../util/api/userAPI';
import { useDispatch } from 'react-redux';
import { useLoaderData, useLocation, useNavigate } from 'react-router-dom';
import { userActions } from '../store/user';
import { categoryActions } from '../store/category';

function Auth() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const location = useLocation();
    const from = location.state?.from?.pathname;

    const loaderData: any = useLoaderData();

    const [isLoginMode, setIsLoginMode] = useState(true);

    const logo = require('../assets/png/logo.png');

    useEffect(() => {
        if (loaderData) {
            setUserData(loaderData.user);
        }
    }, [loaderData]);

    const setUserData = (user: any) => {
        dispatch(userActions.login());
        dispatch(categoryActions.setCategories(user.categories));
        navigate(from || '/budget', { replace: true });
    };

    const registerButtons = (
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

    const loginButtons = (
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
            {isLoginMode ? (
                <LoginForm setUserData={setUserData} />
            ) : (
                <RegisterForm />
            )}
            {isLoginMode ? registerButtons : loginButtons}
        </div>
    );
}

export const loader = () => {
    return getUserState();
};

export default Auth;
