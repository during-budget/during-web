import { getAuthURL } from '../../util/api/authAPI';

/**
 * @title 소셜 로그인 버튼
 * @description 각 버튼은 구글/네이버/카카오에서 제공하는 가이드라인에 따라 디자인되어야 합니다.
 */

const url = `assets/svg/`;

// guideline: https://developers.google.com/identity/branding-guidelines?hl=ko
const GoogleLoginButton = ({}) => (
  <button type={'button'}>
    <img src={url + 'social_icon_google.svg'} alt="Google login button" />
  </button>
);

// guideline: https://developers.naver.com/docs/login/bi/bi.md
const NaverLoginButton = ({}) => (
  <button type={'button'}>
    <img src={url + 'social_icon_naver.svg'} alt="Naver login button" />
  </button>
);

// resource: https://developers.kakao.com/tool/resource/login
const KakaoLoginButton = ({}) => (
  <button type={'button'}>
    <img src={url + 'social_icon_kakao.svg'} alt="Kakao login button" />
  </button>
);

const SNSButtons = ({ isWebview }: { isWebview?: boolean }) => {
  return (
    <div className="flex-column i-center">
      <div
        className="w-100 flex-column i-center"
        css={{ marginTop: '3vh', '& img': { width: '9.5vh' } }}
      >
        <div className="w-100 flex j-center gap-md my-1.5">
          {!isWebview && (
            <a href={getAuthURL('google')}>
              <GoogleLoginButton />
            </a>
          )}
          <a href={getAuthURL('naver')}>
            <NaverLoginButton />
          </a>
          <a href={getAuthURL('kakao')}>
            <KakaoLoginButton />
          </a>
        </div>
      </div>
    </div>
  );
};

export default SNSButtons;
