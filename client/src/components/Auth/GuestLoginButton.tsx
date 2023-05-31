import { useAppDispatch } from '../../hooks/redux-hook';
import { uiActions } from '../../store/ui';
import { guestLogin } from '../../util/api/authAPI';
import { UserDataType } from '../../util/api/userAPI';
import Button from '../UI/Button';

interface GuestLoginButtonProps {
  onLogin: (user: UserDataType, to: string) => void;
}

const GuestLoginButton = ({ onLogin }: GuestLoginButtonProps) => {
  const dispatch = useAppDispatch();

  const guestHandler = async () => {
    try {
      const data = await guestLogin();
      onLogin(data.user, '/init');
    } catch (error) {
      const message = (error as Error).message;
      dispatch(uiActions.showErrorModal({ description: message }));
      throw new Error(message);
    }
  };

  return (
    <Button styleClass="extra" onClick={guestHandler}>
      가입 없이 둘러보기
    </Button>
  );
};

export default GuestLoginButton;
