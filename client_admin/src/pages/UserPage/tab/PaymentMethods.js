import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import useAPI from "../../../hooks/useAPI";
import Table from "../../../components/Table";
import Input from "../../../components/Input";
import { Tag } from "antd";

function Index() {
  const navigate = useNavigate();
  const { _id } = useParams();
  const API = useAPI();

  const [pmList, setPMList] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const updateData = async () => {
    const { user } = await API.GET({ location: "users/" + _id });
    setPMList(user.paymentMethods);
  };

  useEffect(() => {
    if (isLoading) {
      updateData()
        .then(() => {
          setIsLoading(false);
        })
        .catch((err) => {
          alert(err.response.data.message);
          return navigate("/users");
        });
    }
    return () => {};
  }, [isLoading]);

  return !isLoading ? (
    <div>
      <Table
        expandable={{
          expandedRowRender: (record) => {
            return (
              <div
                style={{
                  marginLeft: "120px",
                  marginRight: "120px",
                  display: "flex",
                  gap: "24px",
                  flexDirection: "column",
                }}
              >
                {Object.keys(record).map((key) => (
                  <Input label={key} value={record[key]} disable />
                ))}
              </div>
            );
          },
        }}
        columns={[
          {
            key: "_id",
            type: "button-copy",
            width: "112px",
          },
          {
            key: "type",
            width: "112px",
            render: (e) => {
              return <Tag color={e === "card" ? "black" : "gray"}>{e}</Tag>;
            },
          },
          {
            key: "icon",
            width: "112px",
          },
          {
            key: "title",
          },
          {
            key: "detail",
          },
          {
            key: "isChecked",
            width: "112px",
            render: (e) => {
              return e === true ? (
                <Tag color={"blue"}>TRUE</Tag>
              ) : (
                <Tag color={"red"}>FALSE</Tag>
              );
            },
          },
          {
            key: "detail",
            type: "expand-detail",
          },
        ]}
        rows={pmList.map((pm) => {
          return { ...pm, key: pm._id };
        })}
      />
    </div>
  ) : (
    <div>loading...</div>
  );
}

export default Index;
