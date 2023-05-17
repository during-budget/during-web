import { getAuthURL } from '../../util/api/snsIdAPI';
import Button from '../UI/Button';
import classes from './SNSForm.module.css';
import {
  GoogleLoginButton,
  KakaoLoginButton,
  NaverLoginButton,
} from './SocialLoginButton';

function SNSForm(props: {
  isLogin: boolean;
  toggleIsLogin: () => void;
  changeAuthType: () => void;
  getUserLogin: (user: any) => void;
}) {
  return (
    <div className={classes.sns}>
      <img src="/assets/images/logo.png" alt="듀링 가계부 로고" />
      <h2>시작하기</h2>

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
          <Button styleClass="extra">
            가입 없이 둘러보기
          </Button>
          <span>|</span>
          <Button
            styleClass="extra"
            onClick={props.changeAuthType}
          >
            이메일로 시작하기
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SNSForm;
