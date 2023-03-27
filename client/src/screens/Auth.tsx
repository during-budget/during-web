import { useState } from 'react';
import EmailForm from '../components/Auth/EmailForm';
import SNSForm from '../components/Auth/SNSForm';
import Overlay from '../components/UI/Overlay';
import { getUserState } from '../util/api/userAPI';
import classes from './Auth.module.css';

function Auth() {
    const [isEmailAuth, setIsEmailAuth] = useState(true);
    const [isLogin, setIsLogin] = useState(true);

    const setEmailAuth = () => {
        setIsEmailAuth(true);
    };

    const setSNSAuth = () => {
        setIsEmailAuth(false);
    };

    const toggleIsLogin = () => {
        setIsLogin((prev) => !prev);
    };

    return (
        <Overlay
            className={isEmailAuth ? classes.email : classes.sns}
            isOpen={true}
        >
            {isEmailAuth ? (
                <EmailForm
                    isLogin={isLogin}
                    toggleIsLogin={toggleIsLogin}
                    changeAuthType={setSNSAuth}
                />
            ) : (
                <SNSForm
                    isLogin={isLogin}
                    toggleIsLogin={toggleIsLogin}
                    changeAuthType={setEmailAuth}
                />
            )}
        </Overlay>
    );
}

export const loader = () => {
    return getUserState();
};

export default Auth;
