// reference: https://velog.io/@jiseong/ProPro-%EA%B5%AC%EA%B8%80-%EB%A1%9C%EA%B7%B8%EC%9D%B8-%EB%B3%80%EA%B2%BD

import React, { useEffect, useState } from "react";
import { Button, Card, Col, Divider, Row } from "antd";

import {
  GoogleLoginButton,
  NaverLoginButton,
  KakaoLoginButton,
} from "../../../components/SocialLoginButton";

import useAPI from "../../../hooks/useAPI";
import Detail from "../../../components/Detail";

const Index = () => {
  const API = useAPI();

  const [isLoading, setIsLoading] = useState(true);
  const [snsId, setSnsId] = useState({});

  useEffect(() => {
    if (isLoading) {
      API.GET({ location: "auth" })
        .then((res) => {
          if (res.snsId) {
            setSnsId(res.snsId);
          }
        })
        .catch((err) => {
          alert("ERROR!");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }

    return () => {};
  }, [isLoading]);

  return (
    <div>
      <div>
        <Row gutter={16}>
          <Col span={6}>
            <Card title="Google" bordered={false}>
              {snsId?.google ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "24px",
                  }}
                >
                  <Button
                    onClick={async (e) => {
                      try {
                        const { snsId } = await API.DELETE({
                          location: "auth/google",
                        });
                        setSnsId(snsId ?? {});
                        setIsLoading(true);
                      } catch (err) {
                        alert(
                          err.response.data?.message
                            ? err.response.data?.message
                            : "ERROR!"
                        );
                        console.error(err);
                      }
                    }}
                  >
                    DISCONNECT
                  </Button>
                </div>
              ) : (
                <div style={{ margin: "24px" }}>
                  <a href="http://localhost:5555/api/auth/google">
                    <button>connect</button>
                    {/* <GoogleLoginButton style={{ text: "continue_with" }} /> */}
                  </a>
                </div>
              )}
            </Card>
          </Col>
          <Col span={6}>
            <Card title="Apple" bordered={false}>
              {snsId?.apple ? (
                <div>
                  <span>{`Connected to ${snsId.apple}`}</span>
                  <Button
                    onClick={async (e) => {
                      try {
                        // const { snsId } = await API.DELETE({
                        //   location: "snsId/google",
                        // });
                        // setSnsId(snsId ?? {});
                      } catch (err) {
                        alert(
                          err.response.data?.message
                            ? err.response.data?.message
                            : "ERROR!"
                        );
                        console.error(err);
                      }
                    }}
                  >
                    DISCONNECT
                  </Button>
                </div>
              ) : (
                <div style={{ margin: "24px" }}>
                  <button disabled>connect</button>
                </div>
              )}
            </Card>
          </Col>
          <Col span={6}>
            <Card title="Naver" bordered={false}>
              {snsId?.naver ? (
                <div>
                  <Button
                    onClick={async (e) => {
                      try {
                        const { snsId } = await API.DELETE({
                          location: "auth/naver",
                        });
                        setSnsId(snsId ?? {});
                      } catch (err) {
                        alert(
                          err.response.data?.message
                            ? err.response.data?.message
                            : "ERROR!"
                        );
                        console.error(err);
                      }
                    }}
                  >
                    DISCONNECT
                  </Button>
                </div>
              ) : (
                <div style={{ margin: "24px" }}>
                  <a href="http://localhost:5555/api/auth/naver">
                    <NaverLoginButton style={{ width: "180px" }} />
                  </a>
                </div>
              )}
            </Card>
          </Col>
          <Col span={6}>
            <Card title="KaKao" bordered={false}>
              {snsId?.kakao ? (
                <div>
                  <Button
                    onClick={async (e) => {
                      try {
                        const { snsId } = await API.DELETE({
                          location: "auth/kakao",
                        });
                        setSnsId(snsId ?? {});
                      } catch (err) {
                        alert(
                          err.response.data?.message
                            ? err.response.data?.message
                            : "ERROR!"
                        );
                        console.error(err);
                      }
                    }}
                  >
                    DISCONNECT
                  </Button>
                </div>
              ) : (
                <div style={{ margin: "24px" }}>
                  <a href="http://localhost:5555/api/auth/kakao">
                    <KakaoLoginButton style={{ width: "180px" }} />
                  </a>
                </div>
              )}
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Index;
