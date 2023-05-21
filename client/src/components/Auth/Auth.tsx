import { useEffect, useState } from 'react';
import { UserDataType, getUserState } from '../../util/api/userAPI';
import Modal from '../UI/Modal';
import Overlay from '../UI/Overlay';
import classes from './Auth.module.css';
import EmailForm from './EmailForm';
import SNSForm from './SNSForm';

interface AuthProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: UserDataType, to: string) => void;
}

function Auth({ isOpen, onClose, onLogin }: AuthProps) {
  const [isEmailAuth, setIsEmailAuth] = useState(false);

  // Set state
  const setEmailAuth = () => {
    setIsEmailAuth(true);
  };

  const setSNSAuth = () => {
    setIsEmailAuth(false);
  };

  useEffect(() => {
    if (isOpen) {
      setSNSAuth();
    }
  }, [isOpen]);

  return (
    <>
      <Overlay
        className={`${classes.auth} ${isOpen ? classes.open : ''} ${
          isEmailAuth ? classes.email : classes.sns
        }`}
        isOpen={isOpen}
        onClose={onClose}
      >
        {isEmailAuth ? (
          <EmailForm changeAuthType={setSNSAuth} onLogin={onLogin} />
        ) : (
          <SNSForm changeAuthType={setEmailAuth} onLogin={onLogin} />
        )}
      </Overlay>
      <Modal />
    </>
  );
}

export const loader = async () => {
  return getUserState();
};

export default Auth;
