import * as Sentry from '@sentry/browser';
import { PropsWithChildren, useEffect } from 'react';
import {
  Navigate,
  useLoaderData,
  useLocation,
  useNavigate,
  useNavigation,
} from 'react-router-dom';
import LoadingSpinner from '../components/UI/component/LoadingSpinner';
import { useAppDispatch } from '../hooks/useRedux';
import Channel from '../models/Channel';
import { assetActions } from '../store/asset';
import { uiActions } from '../store/ui';
import { userActions } from '../store/user';
import { userCategoryActions } from '../store/user-category';
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
        tel,
        snsId,
        isGuest,
        categories,
        assets,
        cards,
        paymentMethods,
      } = userData;

      // set user data
      dispatch(userActions.login(userData)); // set login, user info, auth info
      dispatch(userCategoryActions.setCategories(categories));
      dispatch(assetActions.setAssets(assets));
      dispatch(assetActions.setCards(cards));
      dispatch(assetActions.setPaymentMethods(paymentMethods));

      // set sentry
      Sentry.setUser({ id: _id, username: userName, email, snsId });

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
    }
  }, [userData]);

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
