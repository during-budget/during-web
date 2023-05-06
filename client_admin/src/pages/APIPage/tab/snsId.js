// reference: https://velog.io/@jiseong/ProPro-%EA%B5%AC%EA%B8%80-%EB%A1%9C%EA%B7%B8%EC%9D%B8-%EB%B3%80%EA%B2%BD

import React, { useEffect, useState } from "react";
import { Button, Card, Col, Row } from "antd";

import { GoogleLoginButton } from "../../../components/SocialLoginButton";

import useAPI from "../../../hooks/useAPI";

const Index = () => {
  const API = useAPI();

  const [isLoading, setIsLoading] = useState(true);
  const [snsId, setSnsId] = useState({});

  useEffect(() => {
    if (isLoading) {
      API.GET({ location: "snsId" })
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
                <div>
                  <h3>{snsId.google}</h3>
                  <Button
                    onClick={async (e) => {
                      try {
                        const { snsId } = await API.DELETE({
                          location: "snsId/google",
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
                  <GoogleLoginButton
                    style={{ text: "continue_with" }}
                    callback={async (res) => {
                      try {
                        const { snsId } = await API.POST({
                          location: "snsId/google",
                          data: { credential: res.credential },
                        });
                        setSnsId(snsId);
                        setIsLoading(true);
                      } catch (err) {
                        alert(
                          err.response.data?.message
                            ? err.response.data?.message
                            : "ERROR!"
                        );
                      }
                    }}
                  />
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
                  <span>{`Connected to ${snsId.naver}`}</span>
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
            <Card title="KaKao" bordered={false}>
              {snsId?.kakao ? (
                <div>
                  <span>{`Connected to ${snsId.kakao}`}</span>
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
        </Row>
      </div>
    </div>
  );
};

export default Index;
