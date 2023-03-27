import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLoaderData, useLocation, useNavigate } from 'react-router';
import EmailForm from '../components/Auth/EmailForm';
import SNSForm from '../components/Auth/SNSForm';
import Overlay from '../components/UI/Overlay';
import { budgetActions } from '../store/budget';
import { categoryActions } from '../store/category';
import { userActions } from '../store/user';
import { getBudgetList } from '../util/api/budgetAPI';
import { getUserState } from '../util/api/userAPI';
import classes from './Auth.module.css';

function Auth() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isEmailAuth, setIsEmailAuth] = useState(true);
    const [isLogin, setIsLogin] = useState(true);

    // Get login
    const location = useLocation();
    const loaderData: any = useLoaderData();
    const from = location.state?.from?.pathname;

    useEffect(() => {
        if (loaderData) {
            getUserLogin(loaderData.user);
        }
    }, [loaderData]);

    const getUserLogin = async (user: any) => {
        // set user data
        dispatch(userActions.login());
        dispatch(categoryActions.setCategories(user.categories));

        // set budget data
        const budgetsData = await getBudgetList();
        const budgets = budgetsData.budgets;
        dispatch(budgetActions.setBudgets(budgets));

        navigate(from || '/budget', { replace: true });
    };

    // Set state
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
                    getUserLogin={getUserLogin}
                />
            ) : (
                <SNSForm
                    isLogin={isLogin}
                    toggleIsLogin={toggleIsLogin}
                    changeAuthType={setEmailAuth}
                    getUserLogin={getUserLogin}
                />
            )}
        </Overlay>
    );
}

export const loader = () => {
    return getUserState();
};

export default Auth;
