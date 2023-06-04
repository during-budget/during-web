import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import useAPI from "../../../hooks/useAPI";
import Table from "../../../components/Table";
import Detail from "../../../components/Detail";
import Loading from "../../../components/Loading";
import { Tag } from "antd";

function Index() {
  const navigate = useNavigate();
  const { _id } = useParams();
  const API = useAPI();

  const [payments, setPayments] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const updateData = async () => {
    const { payments } = await API.GET({ location: "payments?userId" + _id });
    setPayments(payments);
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
          expandedRowRender: Detail,
        }}
        columns={[
          {
            key: "_id",
            type: "button-copy",
            width: "52px",
          },
          {
            key: "merchant_uid",
            type: "button-copy",
            width: "120px",
          },
          {
            key: "status",
            type: "tag",
            width: "112px",
            render: (e) => {
              let color = "grey";
              if (e === "paid") color = "blue";
              else if (e === "cancelled") color = "red";

              return (
                <div>
                  <Tag color={color}>{e}</Tag>
                </div>
              );
            },
          },

          {
            key: "itemId",
            type: "button-copy",
            width: "112px",
          },
          {
            key: "itemType",
          },
          {
            key: "itemTitle",
          },
          {
            key: "amount",
          },
          {
            key: "rawPaymentData",
            render: (e) => {
              return <div>{e ? "..." : ""}</div>;
            },
          },
          {
            key: "_detail",
            type: "expand-detail",
          },
        ]}
        rows={payments.map((payment) => {
          return { ...payment, key: payment._id };
        })}
      />
    </div>
  ) : (
    <Loading />
  );
}

export default Index;
