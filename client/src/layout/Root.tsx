import { useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import AmountOverlay from '../components/Budget/Input/AmountOverlay';
import PaymentOverlay from '../components/Payment/PaymentOverlay';
import Modal from '../components/UI/Modal';
import { useAppDispatch, useAppSelector } from '../hooks/redux-hook';
import Channel from '../models/Channel';
import { uiActions } from '../store/ui';
import classes from './Root.module.css';

function Root() {
  const dispatch = useAppDispatch();
  const location = useLocation();

  const { isGuest } = useAppSelector((state) => state.user.auth);

  useEffect(() => {
    const setPlatform = (event: MessageEvent) => {
      const { platform } = JSON.parse(event.data);

      if (platform === 'android' || platform === 'iOS') {
        dispatch(uiActions.setPlatform(platform));
      }
    };

    // android
    // document.addEventListener('message', setPlatform);
    // ios
    window.addEventListener('message', setPlatform);
  });

  useEffect(() => {
    if (location.pathname !== '/user') {
      Channel.hideChannelButton();
    } else {
      Channel.showChannelButton();
    }
  }, [location.pathname]);

  return (
    <>
      {isGuest && !['/user'].includes(location.pathname) && location.pathname !== '/' && (
        <Link className={classes.guest} to="/user?register">
          ⚠️ 게스트 계정입니다. 데이터 저장을 위해서 <u>계정 등록</u>을 진행해주세요
        </Link>
      )}
      <Outlet />
      <Modal />
      <AmountOverlay />
      <PaymentOverlay />
    </>
  );
}

export const loader = async () => {
  if (!navigator.onLine) {
    throw new Response('네트워크 연결을 확인해주세요.');
  } else {
    return true;
  }
};

export default Root;
