import React, { useEffect, useState } from "react";
import { Button, Card, Col, Row } from "antd";

import useAPI from "../../../hooks/useAPI";

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

  const MyCard = ({ sns }) => (
    <Card title={sns} bordered={false}>
      {snsId && snsId[sns] ? (
        <Button
          onClick={async (e) => {
            try {
              const { snsId } = await API.DELETE({
                location: "auth/" + sns,
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
      ) : (
        <a href={"http://localhost:5555/api/auth/" + sns}>
          <Button>CONNECT</Button>
        </a>
      )}
    </Card>
  );

  return (
    <div>
      <div>
        <Row gutter={16}>
          <Col span={8}>
            <MyCard sns="google" />
          </Col>
          <Col span={8}>
            <MyCard sns="naver" />
          </Col>
          <Col span={8}>
            <MyCard sns="kakao" />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Index;
