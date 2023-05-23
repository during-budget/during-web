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

export default Root;
