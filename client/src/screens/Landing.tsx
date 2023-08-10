import * as Sentry from '@sentry/browser';
import { useEffect, useState } from 'react';
import { useLoaderData, useLocation, useNavigate } from 'react-router';
import AuthOverlay from '../components/Auth/AuthOverlay';
import LandingCarousel from '../components/Landing/LandingCarousel';
import Button from '../components/UI/Button';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import Privacy from '../components/User/Info/Privacy';
import Terms from '../components/User/Info/Terms';
import { useAppDispatch } from '../hooks/useRedux';
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
import { useToggleOptions } from '../hooks/useToggle';

const { DURING_CHANNEL_KEY } = import.meta.env;

const containerStyle = {
  maxWidth: 480,
};

const buttonStyle = {
  margin: '8vh 0',
};

const Landing = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [{ auth, terms, privacy }, openOverlay, closeOverlay] = useToggleOptions({
    auth: false,
    terms: false,
    privacy: false,
  });
  const [isLoaded, setIsLoaded] = useState(false);

  const location = useLocation();
  const loaderData = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const from = location.state?.from?.pathname;
  const hash = location.hash;

  useEffect(() => {
    if (hash.includes('privacy-policy')) {
      openOverlay('privacy');
    }

    if (hash.includes('terms')) {
      openOverlay('terms');
    }
  }, []);

  useEffect(() => {
    if (loaderData && loaderData.user) {
      getUserLogin(loaderData.user, from || '/budget');
    } else {
      setIsLoaded(true);
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
    Sentry.setUser({ id: _id, username: userName, email, snsId });

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
    closeOverlay('auth');
    setIsLoaded(false);

    dispatch(
      uiActions.showErrorModal({
        description: message,
      })
    );

    navigate('/user');
  };

  if (isLoaded) {
    return (
      <div
        id="landing-container"
        className="flex-column flex-center w-70 vh-100 mx-auto"
        css={containerStyle}
      >
        <img src="/images/logo.png" alt="듀링 가계부 로고" css={{ width: '2.5rem' }} />
        <LandingCarousel />
        <Button onClick={openOverlay.bind(null, 'auth')} sizeClass="lg" css={buttonStyle}>
          듀링 가계부 시작하기
        </Button>
        <div className="w-100 flex gap-md i-center">
          <Button
            onClick={openOverlay.bind(null, 'terms')}
            styleClass="extra"
            css={{ flexShrink: 1.3 }}
          >
            이용약관
          </Button>
          <span>{' | '}</span>
          <Button
            className="mx-1.5"
            styleClass="extra"
            onClick={openOverlay.bind(null, 'privacy')}
          >
            개인정보처리방침
          </Button>
        </div>
        <AuthOverlay
          isOpen={auth}
          onClose={closeOverlay.bind(null, 'auth')}
          onLogin={getUserLogin}
        />
        <Terms isOpen={terms} onClose={closeOverlay.bind(null, 'terms')} />
        <Privacy isOpen={privacy} onClose={closeOverlay.bind(null, 'privacy')} />
      </div>
    );
  } else {
    return <LoadingSpinner isFull={true} />;
  }
};

export const loader = async () => {
  return getUserState();
};

export default Landing;
