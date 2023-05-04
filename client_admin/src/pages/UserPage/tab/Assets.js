import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import useAPI from "../../../hooks/useAPI";
import Table from "../../../components/Table";
import Input from "../../../components/Input";

function Index() {
  const navigate = useNavigate();
  const { _id } = useParams();
  const API = useAPI();

  const [assets, setAssets] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const updateData = async () => {
    const { user } = await API.GET({ location: "users/" + _id });
    setAssets(user.assets);
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
            dataIndex: "_id",
            title: "_id",
            type: "button-copy",
            width: "112px",
          },
          {
            key: "icon",
            width: "112px",
          },
          {
            key: "title",
          },
          {
            key: "amount",
          },
          {
            key: "detail",
            type: "expand-detail",
          },
        ]}
        rows={assets.map((asset) => {
          return { ...asset, key: asset._id };
        })}
      />
    </div>
  ) : (
    <div>loading...</div>
  );
}

export default Index;
