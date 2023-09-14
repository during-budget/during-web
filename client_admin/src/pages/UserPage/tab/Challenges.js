import React from "react";
import { useRef } from "react";
import { useParams } from "react-router-dom";

import {
  Button,
  Col,
  Drawer,
  Form,
  Input,
  Row,
  Space,
  DatePicker,
  Select,
} from "antd";
import useAPI from "../../../hooks/useAPI";

import TableTab from "../../../components/TableTab";

import { Tag } from "antd";
const { RangePicker } = DatePicker;

const AddDrawer = ({ setIsActive, setIsLoading }) => {
  const API = useAPI();
  const inputRef = useRef({
    startDate: "",
    endDate: "",
    type: "category",
    amount: 0,
    comparison: "lt",
    categoryId: "",
    tag: "",
  });

  const submitHandler = async () => {
    try {
      const startDate = inputRef.current.startDate;
      const endDate = inputRef.current.endDate;
      const type = inputRef.current.type;
      const amount = inputRef.current.amount;
      const comparison = inputRef.current.comparison;
      const categoryId = inputRef.current.categoryId;
      const tag = inputRef.current.tag;

      await API.POST({
        location: "challenges",
        data: {
          startDate: startDate !== "" ? startDate : undefined,
          endDate: startDate !== "" ? endDate : undefined,
          type: startDate !== "" ? type : undefined,
          amount,
          comparison: comparison !== "" ? comparison : undefined,
          categoryId: categoryId !== "" ? categoryId : undefined,
          tag: tag !== "" ? tag : undefined,
        },
      });
      alert("SUCCESS");
      setIsLoading(true);
      setIsActive(false);
    } catch (err) {
      alert(err.response?.data?.message ?? "ERROR");
      console.error(err);
    }
  };

  return (
    <Drawer
      title={`Create a new challenge`}
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
            <Col span={6}>
              <Form.Item
                name="startDate"
                label="startDate"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <RangePicker
                  required
                  placeholder={["startDate", "endDate"]}
                  onChange={(e) => {
                    const startDate = e[0]["$d"];
                    const endDate = e[1]["$d"];
                    inputRef.current.startDate = startDate;
                    inputRef.current.endDate = endDate;
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="type"
                label="type"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Select
                  defaultValue="category"
                  style={{ width: 120 }}
                  onChange={(e) => {
                    inputRef.current.type = e;
                  }}
                  options={[
                    { value: "category", label: "category" },
                    { value: "tag", label: "tag" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="categoryId" label="categoryId">
                <Input
                  required
                  placeholder="Please enter categoryId"
                  onChange={(e) => {
                    console.log(e.target.value);
                    inputRef.current.categoryId = e.target.value;
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="tag" label="tag">
                <Input
                  required
                  placeholder="Please enter tag"
                  onChange={(e) => {
                    inputRef.current.tag = e.target.value;
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="comparison"
                label="comparison"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Select
                  defaultValue="lt"
                  style={{ width: 120 }}
                  onChange={(e) => {
                    inputRef.current.comparison = e;
                  }}
                  options={[
                    { value: "lt", label: "lt" },
                    { value: "lte", label: "lte" },
                    { value: "gt", label: "gt" },
                    { value: "gte", label: "gte" },
                  ]}
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

const EditDrawer = ({ item, setIsActive, setIsLoading }) => {
  const API = useAPI();
  const inputRef = useRef({
    startDate: item.startDate,
    endDate: item.endDate,
    type: item.type,
    amount: item.amount,
    comparison: item.comparison,
    categoryId: item.comparison,
    tag: item.tag,
  });

  const submitHandler = async () => {
    try {
      const startDate = inputRef.current.startDate;
      const endDate = inputRef.current.endDate;
      const type = inputRef.current.type;
      const amount = inputRef.current.amount;
      const comparison = inputRef.current.comparison;
      const tag = inputRef.current.tag;

      await API.PUT({
        location: "challenges/" + item._id,
        data: {
          startDate: startDate !== "" ? startDate : undefined,
          endDate: startDate !== "" ? endDate : undefined,
          type: startDate !== "" ? type : undefined,
          amount,
          comparison: comparison !== "" ? comparison : undefined,
          tag: tag !== "" ? tag : undefined,
        },
      });
      alert("SUCCESS");
      setIsLoading(true);
      setIsActive(false);
    } catch (err) {
      alert(err.response?.data?.message ?? "ERROR");
      console.error(err);
    }
  };

  return (
    <Drawer
      title={`Create a new challenge`}
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
            <Col span={6}>
              <Form.Item
                name="range"
                label="startDate-endDate"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <RangePicker
                  required
                  placeholder={[item.startDate, item.endDate]}
                  onChange={(e) => {
                    const startDate = e[0]["$d"];
                    const endDate = e[1]["$d"];
                    inputRef.current.startDate = startDate;
                    inputRef.current.endDate = endDate;
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="type"
                label="type"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Select
                  defaultValue={item.type}
                  style={{ width: 120 }}
                  onChange={(e) => {
                    inputRef.current.type = e;
                  }}
                  options={[
                    { value: "category", label: "category" },
                    { value: "tag", label: "tag" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="categoryId" label="categoryId">
                <Input
                  defaultValue={item.categoryId}
                  required
                  placeholder="Please enter categoryId"
                  onChange={(e) => {
                    inputRef.current.categoryId = e.target.value;
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="tag" label="tag">
                <Input
                  defaultValue={item.tag}
                  required
                  placeholder="Please enter tag"
                  onChange={(e) => {
                    inputRef.current.tag = e.target.value;
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="comparison"
                label="comparison"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Select
                  defaultValue={item.comparison}
                  style={{ width: 120 }}
                  onChange={(e) => {
                    inputRef.current.comparison = e;
                  }}
                  options={[
                    { value: "lt", label: "lt" },
                    { value: "lte", label: "lte" },
                    { value: "gt", label: "gt" },
                    { value: "gte", label: "gte" },
                  ]}
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
                  defaultValue={item.price}
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

function Index() {
  const { _id } = useParams();
  const API = useAPI();

  return (
    <div>
      <TableTab
        title="challenge"
        AddDrawer={AddDrawer}
        EditDrawer={EditDrawer}
        onLoadHandler={async () => {
          const { challengeList } = await API.GET({
            location: "challenges?userId" + _id,
          });
          return challengeList;
        }}
        onRemoveHandler={async (e) => {
          await API.DELETE({ location: "challenges/" + e._id });
        }}
        columns={[
          {
            key: "_id",
            type: "button-copy",
            width: "52px",
          },
          {
            key: "startDate",
            width: "120px",
          },
          {
            key: "endDate",
            width: "120px",
          },
          {
            key: "type",
            type: "tag",
            width: "112px",
            render: (e) => {
              let color = "grey";
              if (e === "category") color = "red";
              else if (e === "tag") color = "blue";

              return (
                <div>
                  <Tag color={color}>{e}</Tag>
                </div>
              );
            },
          },

          {
            key: "categoryId",
            width: "112px",
          },
          {
            key: "tag",
            width: "112px",
          },
          {
            key: "amount",
          },
          {
            key: "comparison",
            type: "tag",
            width: "112px",
            render: (e) => {
              let color = "grey";
              if (e === "lt") color = "red";
              else if (e === "gt") color = "blue";

              return (
                <div>
                  <Tag color={color}>{e}</Tag>
                </div>
              );
            },
          },
          {
            key: "_detail",
            type: "expand-detail",
          },
        ]}
      />
    </div>
  );
}

export default Index;
