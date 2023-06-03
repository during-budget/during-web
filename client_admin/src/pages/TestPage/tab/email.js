import React from "react";
import { Card } from "antd";

const code = "123456";

const Email = ({ type }) => (
  <Card title={type + " 인증 메일입니다"} bordered={false}>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        className={"email"}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          maxWidth: "640px",
          padding: "24px",
        }}
      >
        <div className={"logo"}>
          <img
            src="https://during-logos.s3.ap-northeast-2.amazonaws.com/during_logo_256x256.png"
            alt="During"
            width={"128px"}
          />
        </div>
        <div
          className={"from"}
          style={{
            marginTop: "24px",
            fontStyle: "normal",
            fontWeight: 700,
            fontSize: "2rem",
            lineHeight: "40px",
            color: "#313338",
          }}
        >
          {"During"}
        </div>

        <div
          className={"title"}
          style={{
            marginTop: "24px",
            fontStyle: "normal",
            fontWeight: 700,
            fontSize: "1.75rem",
            lineHeight: "32px",
            color: "#313338",
          }}
        >
          {"로그인 인증 코드입니다"}
        </div>
        <div
          className={"code-wrapper"}
          style={{
            marginTop: "16px",
            lineHeight: "32px",
            backgroundColor: "#F8F8F8",
            width: "108%",
            height: "64px",
            borderRadius: "8px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            className={"code"}
            style={{
              color: "#313338",
              fontSize: "1.75rem",
              lineHeight: "34px",
              textDecorationLine: "underline",
            }}
            onClick={async () => {
              await navigator.clipboard.writeText(code);
              alert("인증 코드가 복사되었습니다");
            }}
          >
            {code}
          </div>
        </div>
        <div
          className={"description"}
          style={{
            marginTop: "16px",
            fontSize: "1rem",
            lineHeight: "19px",
          }}
        >
          {"이 코드는 5분간 유효합니다"}
        </div>
      </div>
    </div>
  </Card>
);

const Index = () => {
  return (
    <div>
      <div>
        <Email type="회원가입" />
      </div>
    </div>
  );
};

export default Index;
