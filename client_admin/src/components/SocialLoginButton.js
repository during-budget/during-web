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
