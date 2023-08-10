import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Modal from '../components/UI/Modal';
import Channel from '../models/Channel';
import { UserDataType } from '../util/api/userAPI';
import { fetchRequest } from '../util/request';

function Root() {
  const location = useLocation();

  // const { isGuest } = useAppSelector((state) => state.user.auth);

  useEffect(() => {
    if (location.pathname !== '/user') {
      Channel.hideChannelButton();
    } else {
      Channel.showChannelButton();
    }
  }, [location.pathname]);

  return (
    <>
      <Outlet />
      <Modal />
    </>
  );
}
// <div>
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
