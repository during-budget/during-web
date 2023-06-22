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

  const [challengeList, setChallengeList] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const updateData = async () => {
    const { challengeList } = await API.GET({
      location: "challenges?userId" + _id,
    });
    setChallengeList(challengeList);
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
        rows={challengeList.map((challenge) => {
          return { ...challenge, key: challenge._id };
        })}
      />
    </div>
  ) : (
    <Loading />
  );
}

export default Index;
