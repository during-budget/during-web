import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import useAPI from "../../hooks/useAPI";
import Table from "../../components/Table";
import HeaderRefresh from "../../components/HeaderRefresh";
import Loading from "../../components/Loading";

import _ from "lodash";

function Index() {
  const navigate = useNavigate();
  const API = useAPI();

  const [budgets, setBudgets] = useState([]);
  const [idFilters, setIdFilters] = useState([]);
  const [userIdFilters, setUserIdFilters] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const updateData = async () => {
    const { budgets } = await API.GET({ location: "budgets?userId=" + "*" });
    setBudgets(_.orderBy(budgets, ["startDate"]));

    setIdFilters(
      budgets.map((b) => {
        return { text: `${b._id}`, value: `${b._id}` };
      })
    );

    const userIds = new Set(budgets.map((b) => b.userId));
    setUserIdFilters(
      Array.from(userIds).map((userId) => {
        return { text: userId, value: userId };
      })
    );
  };

  useEffect(() => {
    if (isLoading) {
      updateData()
        .then(() => {
          setIsLoading(false);
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    }
    return () => {};
  }, [isLoading]);

  return !isLoading ? (
    <div style={{ marginTop: "24px" }}>
      <HeaderRefresh text="budgets" setIsLoading={setIsLoading} />
      <Table
        columns={[
          {
            key: "_id",
            type: "button-copy",
            width: "56px",
            filters: idFilters,
            onFilter: (value, record) => `${record._id}`.startsWith(value),
            filterSearch: true,
          },
          {
            key: "userId",
            type: "button-copy",
            width: "100px",
            filters: userIdFilters,
            onFilter: (value, record) => `${record.userId}`.startsWith(value),
            filterSearch: true,
          },
          {
            key: "title",
            type: "button-detail",
            onClick: (e) => {
              navigate(e._id);
            },
          },

          {
            key: "delete",
            type: "button-delete",
            width: "112px",
            onClick: async (e) => {
              if (
                window.confirm(
                  "정말 삭제하시겠습니까? transactions가 함께 삭제됩니다."
                ) === true
              ) {
                await API.DELETE({ location: "budgets/" + e._id });
                setIsLoading(true);
                alert("success");
              }
            },
          },
        ]}
        rows={budgets.map((category) => {
          return { ...category, key: category._id };
        })}
      />
    </div>
  ) : (
    <Loading />
  );
}

export default Index;
