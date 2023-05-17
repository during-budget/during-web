/**
 * @title 소셜 로그인 버튼
 * @description 각 버튼은 구글/네이버/카카오에서 제공하는 가이드라인에 따라 디자인되어야 합니다.
 */

const url = `assets/svg/`;

// guideline: https://developers.google.com/identity/branding-guidelines?hl=ko
export const GoogleLoginButton = ({}) => (
  <button type={"button"}>
    <img src={url + "social_icon_google.svg"} alt="Google login button" />
  </button>
);

// guideline: https://developers.naver.com/docs/login/bi/bi.md
export const NaverLoginButton = ({}) => (
  <button type={"button"}>
    <img src={url + "social_icon_naver.svg"} alt="Naver login button" />
  </button>
);

// resource: https://developers.kakao.com/tool/resource/login
export const KakaoLoginButton = ({}) => (
  <button type={"button"}>
    <img src={url + "social_icon_kakao.svg"} alt="Kakao login button" />
  </button>
);


