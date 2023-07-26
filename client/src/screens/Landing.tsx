import * as Sentry from '@sentry/browser';
import { useEffect, useState } from 'react';
import { useLoaderData, useLocation, useNavigate } from 'react-router';
import Auth from '../components/Auth/Auth';
import LandingCarousel from '../components/Landing/LandingCarousel';
import Button from '../components/UI/Button';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import Privacy from '../components/User/Info/Privacy';
import Terms from '../components/User/Info/Terms';
import { useAppDispatch } from '../hooks/redux-hook';
import Channel from '../models/Channel';
import { assetActions } from '../store/asset';
import { budgetActions } from '../store/budget';
import { settingActions } from '../store/setting';
import { uiActions } from '../store/ui';
import { userActions } from '../store/user';
import { userCategoryActions } from '../store/user-category';
import { getBudgetById, getBudgetList } from '../util/api/budgetAPI';
import { getOptions } from '../util/api/settingAPI';
import { UserDataType, getUserState } from '../util/api/userAPI';
import { getErrorMessage } from '../util/error';
import classes from './Landing.module.css';

const { DURING_CHANNEL_KEY } = import.meta.env;

const Landing = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [showLogin, setShowLogin] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const location = useLocation();
  const loaderData = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const from = location.state?.from?.pathname;
  const hash = location.hash;

  useEffect(() => {
    if (hash.includes('privacy-policy')) {
      setShowPrivacy(true);
    }

    if (hash.includes('terms')) {
      setShowTerms(true);
    }
  }, []);

  useEffect(() => {
    if (loaderData && loaderData.user) {
      getUserLogin(loaderData.user, from || '/budget');
    } else {
      setIsFirstLoad(false);
    }
  }, [loaderData]);

  const getUserLogin = async (user: UserDataType, to: string) => {
    // get user data
    const {
      _id,
      userName,
      email,
      basicBudgetId: defaultBudgetId,
      categories,
      assets,
      cards,
      tel,
      snsId,
      gender,
      paymentMethods,
      settings,
      isGuest,
      isLocal,
    } = user;

    // set sentry
    Sentry.setUser({ _id, userName, email, snsId });

    // set user data
    dispatch(userActions.login());
    dispatch(
      userActions.setUserInfo({
        _id,
        userName,
        email,
        tel,
        defaultBudgetId,
        gender,
      })
    );
    dispatch(
      userActions.setAuthInfo({
        email,
        isLocal,
        snsId,
        isGuest,
      })
    );
    dispatch(userCategoryActions.setCategories(categories));
    dispatch(assetActions.setAssets(assets));
    dispatch(assetActions.setCards(cards));
    dispatch(assetActions.setPaymentMethods(paymentMethods));

    const { options } = await getOptions('chartSkin');
    dispatch(
      settingActions.setSettings({
        ...settings,
        chartSkin: {
          selected: settings.chartSkin,
          options,
        },
      })
    );

    // Boot channel service
    Channel.boot({
      pluginKey: DURING_CHANNEL_KEY,
      memberId: _id,
      hideChannelButtonOnBoot: true,
      profile: {
        name: userName,
        mobileNumber: tel,
        isGuest,
      },
    });

    // set default budget data
    let defaultBudget;
    try {
      const { budget } = await getBudgetById(defaultBudgetId);
      defaultBudget = budget;
      dispatch(budgetActions.setDefaultBudget(defaultBudget));
    } catch (error) {
      const message = getErrorMessage(error);
      showError(message || '기본 예산을 로드할 수 없습니다.');
      if (!message) throw error;
    }

    // set budget data
    let budgets;
    try {
      const budgetList = await getBudgetList();
      budgets = budgetList.budgets;
      dispatch(budgetActions.setBudgetList(budgets));
      navigate(to, { replace: true });
    } catch (error) {
      const message = getErrorMessage(error);
      showError(message || '예산 목록을 로드할 수 없습니다.');
      if (!message) throw error;
    }
  };

  const showError = async (message: string) => {
    dispatch(userActions.logout());
    setShowLogin(false);
    setIsFirstLoad(false);

    dispatch(
      uiActions.showErrorModal({
        description: message,
      })
    );

    navigate('/user');
  };

  const showTermsHandler = () => {
    setShowTerms(true);
  };

  const showPrivacyHandler = () => {
    setShowPrivacy(true);
  };

  if (isFirstLoad) {
    return <LoadingSpinner isFull={true} />;
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
        <div className={classes.policy}>
          <Button styleClass="extra" onClick={showTermsHandler}>
            이용약관
          </Button>
          <span>{' | '}</span>
          <Button styleClass="extra" onClick={showPrivacyHandler}>
            개인정보처리방침
          </Button>
        </div>
        <Auth
          isOpen={showLogin}
          onClose={() => {
            setShowLogin(false);
          }}
          onLanding={getUserLogin}
        />
        <Terms
          isOpen={showTerms}
          onClose={() => {
            setShowTerms(false);
          }}
        />
        <Privacy
          isOpen={showPrivacy}
          onClose={() => {
            setShowPrivacy(false);
          }}
        />
      </div>
    );
  }
};

export const loader = async () => {
  return getUserState();
};

export default Landing;
