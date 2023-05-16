/**
 * @title 소셜 로그인 버튼
 * @description 각 버튼은 구글/네이버/카카오에서 제공하는 가이드라인에 따라 디자인되어야 합니다.
 */
import React from "react";

const url = `assets/images/`;

const style = {
  cursor: "pointer",
  border: "none",
  backgroundColor: "transparent",
};

const styleImg = {
  width: "180px"
};

// guideline: https://developers.google.com/identity/branding-guidelines?hl=ko
export const GoogleLoginButton = ({}) => (
  <button type={"button"} style={style}>
    <img style={styleImg}  src={url + "google.png"} alt="asdf" />
  </button>
);

// guideline: https://developers.naver.com/docs/login/bi/bi.md
export const NaverLoginButton = ({}) => (
  <button type={"button"} style={style}>
    <img style={styleImg} src={url + "naver.png"} alt="asdf" />
  </button>
);

// resource: https://developers.kakao.com/tool/resource/login
export const KakaoLoginButton = ({}) => (
  <button type={"button"} style={style}>
    <img style={styleImg} src={url + "kakao.png"} alt="asdf" />
  </button>
);


