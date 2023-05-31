import { Outlet } from 'react-router-dom';
import Modal from '../components/UI/Modal';

function Root() {
  return (
    <>
      <Outlet />
      <Modal />
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
