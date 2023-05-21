import { useEffect, useState } from 'react';
import { useLoaderData, useLocation, useNavigate } from 'react-router';
import Auth from '../components/Auth/Auth';
import LandingCarousel from '../components/Landing/LandingCarousel';
import Button from '../components/UI/Button';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { useAppDispatch } from '../hooks/redux-hook';
import { assetActions } from '../store/asset';
import { budgetActions } from '../store/budget';
import { settingActions } from '../store/setting';
import { userActions } from '../store/user';
import { userCategoryActions } from '../store/user-category';
import { getBudgetById, getBudgetList } from '../util/api/budgetAPI';
import { UserDataType, getUserState } from '../util/api/userAPI';
import classes from './Landing.module.css';

const Landing = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [showLogin, setShowLogin] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const location = useLocation();
  const loaderData = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const from = location.state?.from?.pathname;

  useEffect(() => {
    if (loaderData && 'user' in loaderData) {
      getUserLogin(loaderData.user, from || '/budget');
    } else {
      setIsFirstLoad(false);
    }
  }, [loaderData]);

  const getUserLogin = async (user: UserDataType, to: string) => {
    // get user data
    const {
      userName,
      email,
      basicBudgetId: defaultBudgetId,
      categories,
      assets,
      cards,
      paymentMethods,
      settings,
    } = user;

    // set user data
    dispatch(userActions.login());
    dispatch(
      userActions.setUserInfo({
        userName,
        email,
        defaultBudgetId,
        settings,
      })
    );
    dispatch(userCategoryActions.setCategories(categories));
    dispatch(assetActions.setAssets(assets));
    dispatch(assetActions.setCards(cards));
    dispatch(assetActions.setPaymentMethods(paymentMethods));
    dispatch(settingActions.setSettings(settings));

    // set default budget data
    const { budget: defaultBudget } = await getBudgetById(defaultBudgetId);
    dispatch(budgetActions.setDefaultBudget(defaultBudget));

    // set budget data
    const { budgets } = await getBudgetList();
    dispatch(budgetActions.setBudgetList(budgets));

    navigate(to, { replace: true });
  };

  if (isFirstLoad) {
    return (
      <div className={`${classes.full} ${classes.center}`}>
        <LoadingSpinner />
      </div>
    );
  } else {
    return (
      <div className={classes.landing}>
        <img className={classes.logo} src="/images/logo.png" alt="듀링 가계부 로고" />
        <LandingCarousel />
        <Button
          className={classes.button}
          onClick={() => {
            setShowLogin(true);
          }}
        >
          듀링 가계부 시작하기
        </Button>
        <Auth
          isOpen={showLogin}
          onClose={() => {
            setShowLogin(false);
          }}
          onLogin={getUserLogin}
        />
      </div>
    );
  }
};

export const loader = async () => {
  return getUserState();
};

export default Landing;
