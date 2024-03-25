import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Modal from '../components/UI/overlay/Modal';
import Channel from '../models/Channel';
import { UserDataType } from '../util/api/userAPI';
import { fetchRequest } from '../util/request';
import AmountOverlay from '../components/Budget/Input/AmountOverlay';
import PaymentOverlay from '../components/Payment/PaymentOverlay';

function Root() {
  const location = useLocation();

  // const { isGuest } = useAppSelector((state) => state.user.auth);

  useEffect(() => {
    if (location.pathname === '/user' || location.pathname === '/landing') {
      Channel.showChannelButton();
    } else {
      Channel.hideChannelButton();
    }
  }, [location.pathname]);

  return (
    <>
      <Outlet />
      {/* 이 위치가 아닌 다른 곳에 위치시키려고 커맨드아웃시켰던 거 같은데. */}
      <AmountOverlay />
      <PaymentOverlay />
      <Modal />
    </>
  );
}
// <div>
{
  /* 이 위치가 아닌 다른 곳에 위치시키려고 커맨드아웃시켰던 거 같은데. */
}
{
  /* {isGuest && !['/user'].includes(location.pathname) && location.pathname !== '/' && (
        <Link className={classes.guest} to="/user?register">
          ⚠️ 게스트 계정입니다. 데이터 저장을 위해서 <u>계정 등록</u>을 진행해주세요
        </Link>
      )} */
}
{
  /* <Modal />
      <AmountOverlay />
      <PaymentOverlay /> */
}
// </div>

export const loader = async () => {
  if (!navigator.onLine) {
    throw new Response('네트워크 연결을 확인해주세요.');
  }

  try {
    const { user } = await fetchRequest<{ user?: UserDataType }>({
      url: '/users/current',
    });
    return user;
  } catch (error) {
    if ((error as Error).message === 'NOT_LOGGED_IN') {
      return null;
    } else {
      throw error;
    }
  }
};

export default Root;
