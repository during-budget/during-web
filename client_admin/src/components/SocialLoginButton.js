import React from "react";

export const GoogleLoginButton = ({ callback, style }) => {
  const script = document.createElement("script");
  script.src = "https://accounts.google.com/gsi/client";
  script.onload = () => {
    window.google.accounts.id.initialize({
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID?.trim() ?? "",
      callback,
    });
    window.google.accounts.id.renderButton(
      document.getElementById("login-bttn-google"),
      style ?? {}
    );
  };
  document.head.appendChild(script);

  return <div id="login-bttn-google" />;
};

export const NaverLoginButton = ({ callback, style, icon }) => {
  return (
    <button
      type={"button"}
      style={{
        cursor: "pointer",
        border: "none",
        backgroundColor: "transparent",
        ...style,
      }}
    >
      {
        <img
          width={style?.width ?? "240px"}
          src={
            icon
              ? `${process.env.PUBLIC_URL}/assets/images/naver_bttnG_icon.png`
              : `${process.env.PUBLIC_URL}/assets/images/naver_bttnG_standard.png`
          }
          alt="asdf"
        />
      }
    </button>
  );
};

// resource: https://developers.kakao.com/tool/resource/login
export const KakaoLoginButton = ({ callback, style, icon }) => {
  return (
    <button
      onClick={() => {}}
      type={"button"}
      style={{
        cursor: "pointer",
        border: "none",
        backgroundColor: "transparent",
        ...style,
      }}
    >
      {
        <img
          width={style?.width ?? "240px"}
          src={
            icon
              ? `${process.env.PUBLIC_URL}/assets/images/kakao_login_icon.png`
              : `${process.env.PUBLIC_URL}/assets/images/kakao_login_medium_narrow.png`
          }
          alt="asdf"
        />
      }
    </button>
  );
};
