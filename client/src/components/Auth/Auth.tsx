import { useEffect, useState } from 'react';
import { UserDataType } from '../../util/api/userAPI';
import Overlay from '../UI/Overlay';
import classes from './Auth.module.css';
import EmailForm from './EmailForm';
import SNSForm from './SNSForm';

interface AuthProps {
  isOpen: boolean;
  onClose: () => void;
  onLanding: (user: UserDataType, to: string) => void;
}

function Auth({ isOpen, onClose, onLanding }: AuthProps) {
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
          <EmailForm changeAuthType={setSNSAuth} onLanding={onLanding} />
        ) : (
          <SNSForm changeAuthType={setEmailAuth} onLanding={onLanding} />
        )}
      </Overlay>
    </>
  );
}

export default Auth;
