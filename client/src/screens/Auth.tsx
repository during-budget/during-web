import { useState } from 'react';
import { useDispatch } from 'react-redux';
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

    const getUserLogin = async (user: any) => {
        // Set user data
        dispatch(userActions.login());
        dispatch(categoryActions.setCategories(user.categories));

        // Set budget data
        const budgetListData = await getBudgetList();
        console.log(budgetListData);
        dispatch(budgetActions.setBudgets(budgetListData.budgets.budgets));

        // TODO: Navigate to service -> New budget || Recent (date or vistied) budget
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
