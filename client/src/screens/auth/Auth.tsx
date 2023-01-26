import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import classes from './Auth.module.css';
import AuthForm from './AuthForm';

function Auth() {
    const auth = useSelector((state: any) => state.user.isAuthenticated);
    const location = useLocation();
    const from = location.state?.from?.pathname;

    if (auth) {
        return <Navigate to={from} replace />;
    }

    return (
        <>
            <div className={`page ${classes.page}`}>
                <div className={classes.logo}>
                    <img
                        src={require('../../assets/png/logo.png')}
                        alt="During logo"
                    ></img>
                    <h1>During Budget</h1>
                </div>
                <AuthForm from={from}/>
            </div>
        </>
    );
}

export default Auth;
