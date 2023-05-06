import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import useAPI from "../../../hooks/useAPI";
import Table from "../../../components/Table";
import Loading from "../../../components/Loading";

import _ from "lodash";

function Index() {
  const navigate = useNavigate();
  const { _id } = useParams();
  const API = useAPI();

  const [budgets, setBudgets] = useState([]);
  const [dateFilters, setDateFilters] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const updateData = async () => {
    const { budgets } = await API.GET({ location: "budgets?userId=" + _id });
    setBudgets(_.orderBy(budgets, ["startDate"]));

    const years = new Set(
      budgets.map((budget) => budget.startDate?.split("-")[0])
    );
    setDateFilters(
      _.sortBy(Array.from(years)).map((year) => {
        return { text: `${year}`, value: `${year}` };
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
          return navigate("/users");
        });
    }
    return () => {};
  }, [isLoading]);

  return !isLoading ? (
    <div>
      <Table
        columns={[
          {
            key: "_id",
            dataIndex: "_id",
            title: "_id",
            type: "button-copy",
            width: "112px",
          },
          {
            key: "startDate",
            width: "240px",
            sorter: (a, b) => a.startDate > b.startDate,
            sortDirections: ["descend"],
            filters: dateFilters,
            onFilter: (value, record) =>
              `${record.startDate}`.startsWith(value),
            filterSearch: true,
          },
          {
            key: "title",
            type: "button-detail",
            onClick: (e) => {
              navigate("budgets/" + e._id);
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
