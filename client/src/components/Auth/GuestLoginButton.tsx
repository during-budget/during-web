import { UserDataType, guestLogin } from '../../util/api/userAPI';
import Button from '../UI/Button';

interface GuestLoginButtonProps {
  onLogin: (user: UserDataType, to: string) => void;
}

const GuestLoginButton = ({ onLogin }: GuestLoginButtonProps) => {
  const guestHandler = async () => {
    const data = await guestLogin();
    onLogin(data.user, '/init');
  };

  return (
    <Button styleClass="extra" onClick={guestHandler}>
      가입 없이 둘러보기
    </Button>
  );
};

export default GuestLoginButton;
