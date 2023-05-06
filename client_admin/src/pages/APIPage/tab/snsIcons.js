import React from "react";
import { Card, Col, Row } from "antd";

import { GoogleLoginButton } from "../../../components/SocialLoginButton";

const Index = () => {
  return (
    <div>
      <div>
        <Row gutter={16}>
          <Col span={6}>
            <Card title="Google" bordered={false}>
              <div style={{ margin: "24px" }}>
                <GoogleLoginButton
                  style={{ width: "250", type: "icon", shape: "circle" }}
                  callback={(res) => {
                    alert(
                      "check console to check credential and call login API"
                    );
                    console.log({ credential: res.credential });
                  }}
                />
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card title="Apple" bordered={false}>
              <div style={{ margin: "24px" }}>
                <button disabled>A</button>
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card title="Naver" bordered={false}>
              <div style={{ margin: "24px" }}>
                <button disabled>N</button>
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card title="KaKao" bordered={false}>
              <div style={{ margin: "24px" }}>
                <button disabled>K</button>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Index;
