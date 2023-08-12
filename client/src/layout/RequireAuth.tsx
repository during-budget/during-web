import * as Sentry from '@sentry/browser';
import { PropsWithChildren, useEffect } from 'react';
import {
  Navigate,
  useLoaderData,
  useLocation,
  useNavigate,
  useNavigation,
} from 'react-router-dom';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { useAppDispatch } from '../hooks/useRedux';
import Channel from '../models/Channel';
import { assetActions } from '../store/asset';
import { budgetActions } from '../store/budget';
import { uiActions } from '../store/ui';
import { userActions } from '../store/user';
import { userCategoryActions } from '../store/user-category';
import { getBudgetById, getBudgetList } from '../util/api/budgetAPI';
import { getErrorMessage } from '../util/error';
import { loader as userLoader } from './Root';

const { DURING_CHANNEL_KEY } = import.meta.env;

interface RequireAuthProps {
  noRequired?: boolean;
}

function RequireAuth({ noRequired, children }: PropsWithChildren<RequireAuthProps>) {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const userData = useLoaderData() as Awaited<ReturnType<typeof userLoader>>;
  const navigation = useNavigation();
  const navigate = useNavigate();

  useEffect(() => {
    if (userData) {
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
      } = userData;

      // set sentry
      Sentry.setUser({ id: _id, username: userName, email, snsId });

      // set auth state
      dispatch(userActions.login());

      // set user data
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

      // const { options } = await getOptions('chartSkin');
      // dispatch(
      //   settingActions.setSettings({
      //     ...settings,
      //     chartSkin: {
      //       selected: settings.chartSkin,
      //       options,
      //     },
      //   })
      // );

      // set default budget data
      const setData = async () => {
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
          // navigate(to, { replace: true });
        } catch (error) {
          const message = getErrorMessage(error);
          showError(message || '예산 목록을 로드할 수 없습니다.');
          if (!message) throw error;
        }
        // navigate(from || '/');
        // redirect(from || '/');
      };
      setData();
    }
  }, [userData]);

  const showError = async (message: string) => {
    dispatch(userActions.logout());
    dispatch(
      uiActions.showErrorModal({
        description: message,
      })
    );

    navigate('/user');
  };

  if (navigation.state === 'loading') {
    return <LoadingSpinner isFull={true} />;
  }

  if (noRequired) {
    if (userData) {
      // 로그인된 사용자가 자격 접근 필요없는 라우터에 접근할 경우
      return <Navigate to="/budget" replace />;
    } else {
      // 로그인되지 않은 사용자가 자격 접근 필요없는 라우터에 접근할 경우
      return <>{children}</>;
    }
  } else {
    if (userData) {
      // 로그인된 사용자가 자격접근 필요한 라우터에 접근할 경우
      return <>{children}</>;
    } else {
      // 로그인되지 않은 사용자가 자격접근 필요한 라우터에 접근할 경우
      return <Navigate to="/landing" replace />;
    }
  }
}

export default RequireAuth;
