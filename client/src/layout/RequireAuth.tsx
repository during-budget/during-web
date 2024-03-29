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
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import Channel from '../models/Channel';
import { assetActions } from '../store/asset';
import { settingActions } from '../store/setting';
import { userActions } from '../store/user';
import { userCategoryActions } from '../store/user-category';
import { getOptions } from '../util/api/settingAPI';
import { loader as userLoader } from './Root';

const { DURING_CHANNEL_KEY } = import.meta.env;

interface RequireAuthProps {
  noRequired?: boolean;
}

function RequireAuth({ noRequired, children }: PropsWithChildren<RequireAuthProps>) {
  const dispatch = useAppDispatch();
  const userDataFromServer = useLoaderData() as Awaited<ReturnType<typeof userLoader>>;
  const navigation = useNavigation();
  

  useEffect(() => {
    if (userDataFromServer) {
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
        settings,
      } = userDataFromServer;

      // set user data
      dispatch(userActions.login(userDataFromServer)); // set login, user info, auth info
      dispatch(userCategoryActions.setCategories(categories));
      dispatch(assetActions.setAssets(assets));
      dispatch(assetActions.setCards(cards));
      dispatch(assetActions.setPaymentMethods(paymentMethods));

      // 필드 추가마다 설정해줘야 함?!
      const setSettings = async () => {
        const { options: skinOptions } = await getOptions('chartSkin');
        dispatch(
          settingActions.updateSetting({
            chartSkin: {
              selected: settings.chartSkin,
              options: skinOptions
            }
          })
        );
      };
      setSettings();

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
  }, [userDataFromServer]);

  if (navigation.state === 'loading') {
    return <LoadingSpinner isFull={true} />;
  }

  if (noRequired) {
    if (userDataFromServer) {
      // 로그인된 사용자가 자격 접근 필요없는 라우터에 접근할 경우
      return <Navigate to="/budget" replace />;
    } else {
      // 로그인되지 않은 사용자가 자격 접근 필요없는 라우터에 접근할 경우
      return <>{children}</>;
    }
  } else {
    if (userDataFromServer) {
      // 로그인된 사용자가 자격접근 필요한 라우터에 접근할 경우
      return <>{children}</>;
    } else {
      // 로그인되지 않은 사용자가 자격접근 필요한 라우터에 접근할 경우
      return <Navigate to="/landing" replace />;
    }
  }
}

export default RequireAuth;
