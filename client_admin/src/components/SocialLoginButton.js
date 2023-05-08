import React from "react";

const url = `${process.env.PUBLIC_URL}/assets/images/`;

const style = {
  cursor: "pointer",
  border: "none",
  backgroundColor: "transparent",
};

const width = "240px";

// guideline: https://developers.google.com/identity/branding-guidelines?hl=ko
export const GoogleLoginButton = ({}) => (
  <button type={"button"} style={style}>
    <img width={width} src={url + "google.png"} alt="asdf" />
  </button>
);

// guideline: https://developers.naver.com/docs/login/bi/bi.md
export const NaverLoginButton = ({}) => (
  <button type={"button"} style={style}>
    <img width={width} src={url + "naver.png"} alt="asdf" />
  </button>
);

// resource: https://developers.kakao.com/tool/resource/login
export const KakaoLoginButton = ({}) => (
  <button type={"button"} style={style}>
    <img width={width} src={url + "kakao.png"} alt="asdf" />
  </button>
);
