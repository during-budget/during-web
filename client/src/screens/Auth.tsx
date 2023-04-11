import { useEffect, useState } from 'react';
import { useLoaderData, useLocation, useNavigate } from 'react-router';
import EmailForm from '../components/Auth/EmailForm';
import SNSForm from '../components/Auth/SNSForm';
import Overlay from '../components/UI/Overlay';
import { budgetActions } from '../store/budget';
import { categoryActions } from '../store/category';
import { userActions } from '../store/user';
import { getBudgetById, getBudgetList } from '../util/api/budgetAPI';
import { UserDataType, getUserState } from '../util/api/userAPI';
import classes from './Auth.module.css';
import { useAppDispatch } from '../hooks/redux-hook';

function Auth() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [isEmailAuth, setIsEmailAuth] = useState(true);
    const [isLogin, setIsLogin] = useState(true);

    // Get login
    const location = useLocation();
    const loaderData = useLoaderData() as Awaited<ReturnType<typeof loader>>;
    const from = location.state?.from?.pathname;

    useEffect(() => {
        if (loaderData) {
            getUserLogin(loaderData.user);
        }
    }, [loaderData]);

    const getUserLogin = async (user: UserDataType) => {
        // get user data
        const { userName, email, basicBudgetId: defaultBudgetId } = user;

        // set user data
        dispatch(userActions.login());
        dispatch(userActions.setUserInfo({ userName, email, defaultBudgetId }));
        dispatch(categoryActions.setCategories(user.categories));

        // set default budget data
        const { budget: defaultBudget } = await getBudgetById(defaultBudgetId);
        dispatch(budgetActions.setBudget(defaultBudget));

        // set budget data
        const { budgets } = await getBudgetList();
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

export const loader = async () => {
    return getUserState();
};

export default Auth;
