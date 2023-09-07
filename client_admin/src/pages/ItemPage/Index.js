import React, { useEffect, useRef, useState } from "react";

import { Button, Col, Drawer, Form, Input, Result, Row, Space } from "antd";
import Table from "../../components/Table.js";
import Tabs from "../../components/Tabs";

import useAPI from "../../hooks/useAPI";
import _ from "lodash";

const NotReady = () => {
  return <Result title="Page is not ready" />;
};

const editMode = false;

const AddDrawer = ({ type, setIsActive, setIsLoading }) => {
  const API = useAPI();
  const inputRef = useRef({ title: "", description: "", price: 0 });

  const submitHandler = async () => {
    try {
      if (inputRef.current.title === "") return alert("TITLE_REQUIRED");

      await API.POST({
        location: "items",
        data: {
          type,
          title: inputRef.current.title,
          description: inputRef.current.description,
          price: inputRef.current.price,
        },
      });
      alert("SUCCESS");
      setIsLoading(true);
      setIsActive(false);
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  return (
    <Drawer
      title={`Create a new item`}
      width={720}
      onClose={() => setIsActive(false)}
      open={true}
      bodyStyle={{
        paddingBottom: 80,
      }}
      placement="bottom"
      extra={
        <Space>
          <Button onClick={() => setIsActive(false)}>Cancel</Button>
          <Button onClick={submitHandler} type="primary">
            Submit
          </Button>
        </Space>
      }
    >
      <div>
        <Form layout="vertical" autoComplete="off">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="title"
                label="title"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input
                  required
                  placeholder="Please enter title"
                  onChange={(e) => {
                    inputRef.current.title = e.target.value;
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="price"
                label="price"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input
                  style={{
                    width: "100%",
                  }}
                  type="number"
                  defaultValue={0}
                  onChange={(e) => {
                    inputRef.current.price = e.target.value;
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </Drawer>
  );
};

const EditDrawer = ({ item, setIsLoading, setIsActive }) => {
  const API = useAPI();
  const inputRef = useRef({
    title: item.title,
    description: item.description,
    price: item.price,
  });

  const editHandler = async () => {
    try {
      if (inputRef.current.title === "") return alert("TITLE_REQUIRED");

      await API.PUT({
        location: "items/" + item._id,
        data: {
          title: inputRef.current.title,
          description: inputRef.current.description,
          price: inputRef.current.price,
        },
      });
      alert("SUCCESS");
      setIsLoading(true);
      setIsActive(false);
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  return (
    <Drawer
      title={`Edit item`}
      width={720}
      onClose={() => setIsActive(false)}
      open={true}
      bodyStyle={{
        paddingBottom: 80,
      }}
      placement="bottom"
      extra={
        <Space>
          <Button onClick={() => setIsActive(false)}>Cancel</Button>
          <Button onClick={editHandler} type="primary">
            Edit
          </Button>
        </Space>
      }
    >
      <div>
        <Form layout="vertical" autoComplete="off">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="title"
                label="title"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input
                  required
                  placeholder="Please enter title"
                  onChange={(e) => {
                    inputRef.current.title = e.target.value;
                  }}
                  defaultValue={item.title}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="price"
                label="price"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input
                  style={{
                    width: "100%",
                  }}
                  type="number"
                  onChange={(e) => {
                    inputRef.current.price = e.target.value;
                  }}
                  defaultValue={item.price}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </Drawer>
  );
};

const TabItem = ({ type }) => {
  const API = useAPI();

  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [item, setItem] = useState();

  const [isActiveAddDrawer, setIsActiveAddDrawer] = useState(false);
  const [isActiveEditDrawer, setIsActiveEditDrawer] = useState(false);

  const removeHandler = async (e) => {
    if (window.confirm("정말 삭제하시겠습니까?") === true) {
      try {
        await API.DELETE({ location: "items/" + e._id });
        alert("SUCCESS");
        setIsLoading(true);
      } catch (err) {
        alert(err.response.data.message);
      }
    }
  };

  const reloadData = async () => {
    const { items } = await API.GET({ location: "items?type=" + type });
    setItems(_.orderBy(items, ["createdAt"], ["asc"]));
  };

  useEffect(() => {
    if (isLoading) {
      reloadData()
        .then(() => {
          setIsLoading(false);
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    }
    return () => {};
  }, [isLoading]);

  return (
    <>
      <div>
        <div
          style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}
        >
          {editMode && (
            <Button
              type="primary"
              onClick={() => {
                setIsActiveAddDrawer(true);
              }}
            >
              + 생성
            </Button>
          )}
        </div>
        <div style={{ marginTop: "16px" }}>
          <Table
            columns={[
              {
                key: "_id",
                type: "button-copy",
                width: "56px",
              },
              {
                key: "title",
                align: "center",
              },
              {
                key: "price",
                width: "120px",
                align: "center",
              },
              editMode && {
                key: "edit",
                type: "button-detail",
                width: "112px",
                onClick: (e) => {
                  setItem(e);
                  setIsActiveEditDrawer(true);
                },
              },
              editMode && {
                key: "delete",
                type: "button-delete",
                width: "112px",
                onClick: removeHandler,
              },
            ].filter((x) => x)}
            rows={items.map((item) => {
              return { ...item, key: item._id };
            })}
          />
        </div>
      </div>
      {isActiveAddDrawer && (
        <AddDrawer
          type={type}
          setIsActive={setIsActiveAddDrawer}
          setIsLoading={setIsLoading}
        />
      )}
      {isActiveEditDrawer && item && (
        <EditDrawer
          item={item}
          setIsLoading={setIsLoading}
          setIsActive={setIsActiveEditDrawer}
        />
      )}
    </>
  );
};

function Index() {
  return (
    <div style={{ marginTop: "24px" }}>
      <Tabs
        reloadData
        items={[
          { label: "chartSkins", child: <TabItem type={"chartSkin"} /> },
          { label: "undefined", child: <NotReady /> },
        ]}
      />
    </div>
  );
}

export default Index;
