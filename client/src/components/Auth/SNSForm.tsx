import { getAuthURL } from '../../util/api/authAPI';
import { UserDataType } from '../../util/api/userAPI';
import Button from '../UI/Button';
import GuestLoginButton from './GuestLoginButton';
import classes from './SNSForm.module.css';
import {
  GoogleLoginButton,
  KakaoLoginButton,
  NaverLoginButton,
} from './SocialLoginButton';

interface SNSFormProps {
  changeAuthType: () => void;
  onLanding: (user: UserDataType, to: string) => void;
}

const SNSForm = ({ changeAuthType, onLanding }: SNSFormProps) => {
  return (
    <div className={classes.sns}>
      <img src="/images/logo.png" alt="듀링 가계부 로고" />
      <h2>시작하기</h2>
      <p>SNS 계정으로 시작</p>
      <div className={classes.form}>
        <div className={classes.social}>
          <a href={getAuthURL('google')}>
            <GoogleLoginButton />
          </a>
          <a href={getAuthURL('naver')}>
            <NaverLoginButton />
          </a>
          <a href={getAuthURL('kakao')}>
            <KakaoLoginButton />
          </a>
        </div>

        <div className={classes.buttons}>
          <GuestLoginButton onLogin={onLanding} />
          <span>|</span>
          <Button styleClass="extra" onClick={changeAuthType}>
            이메일로 시작하기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SNSForm;
