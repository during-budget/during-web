import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useLoaderData, useLocation } from 'react-router-dom';
import { userActions } from '../../store/user';
import { getCurrentUserState } from '../../util/api';
import classes from './Auth.module.css';
import AuthForm from './AuthForm';

function Auth() {
    const dispatch = useDispatch();
    const loaderData: any = useLoaderData();

    const auth = useSelector((state: any) => state.user.isAuthenticated);
    const location = useLocation();
    const from = location.state?.from?.pathname;

    if (loaderData) {
        dispatch(userActions.login());
    } else {
        dispatch(userActions.logout());
    }

    if (auth) {
        console.log(from);
        if (from === '/' || from === '/auth' || from === undefined) {
            return <Navigate to="/budget" replace />;
        } else {
            return <Navigate to={from} replace />;
        }
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
                <AuthForm from={from} />
            </div>
        </>
    );
}

export const loader = () => {
    return getCurrentUserState();
};

export default Auth;
