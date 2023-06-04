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
  hideGuest?: boolean;
  showEmail?: boolean;
}

export interface AuthFormProps {
  changeAuthType?: () => void;
  onLanding: (user: UserDataType, to: string) => void;
  hideGuest?: boolean;
}

function Auth({ isOpen, onClose, onLanding, hideGuest, showEmail }: AuthProps) {
  const [isEmailAuth, setIsEmailAuth] = useState(showEmail);

  // Set state
  const setEmailAuth = () => {
    setIsEmailAuth(true);
  };

  const setSNSAuth = () => {
    setIsEmailAuth(false);
  };

  useEffect(() => {
    if (isOpen && showEmail) {
      setEmailAuth();
    } else if (isOpen) {
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
          <EmailForm
            changeAuthType={showEmail ? undefined : setSNSAuth}
            onLanding={onLanding}
            hideGuest={hideGuest}
          />
        ) : (
          <SNSForm
            changeAuthType={setEmailAuth}
            onLanding={onLanding}
            hideGuest={hideGuest}
          />
        )}
      </Overlay>
    </>
  );
}

export default Auth;
