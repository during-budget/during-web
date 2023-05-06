import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import useAPI from "../../../hooks/useAPI";
import Table from "../../../components/Table";
import Detail from "../../../components/Detail";
import Loading from "../../../components/Loading";

import { Radio } from "antd";

function Index() {
  const navigate = useNavigate();
  const { _id } = useParams();
  const API = useAPI();

  const [_categories, _setCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryType, setCategoryType] = useState("isExpense");

  const [isLoading, setIsLoading] = useState(true);

  const updateData = async () => {
    const { user } = await API.GET({ location: "users/" + _id });
    _setCategories(user.categories);
    setCategories(user.categories.filter((category) => category.isExpense));
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
      <div style={{ marginBottom: "24px" }}>
        <Radio.Group
          onChange={(e) => {
            setCategoryType(e.target.value);
            if (e.target.value === "isExpense") {
              setCategories(
                _categories.filter((category) => category.isExpense)
              );
            } else {
              setCategories(
                _categories.filter((category) => category.isIncome)
              );
            }
          }}
          value={categoryType}
        >
          <Radio value={"isExpense"}>isExpense</Radio>
          <Radio value={"isIncome"}>isIncome</Radio>
        </Radio.Group>
      </div>
      <Table
        expandable={{
          expandedRowRender: Detail,
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
            dataIndex: "icon",
            width: "112px",
          },
          {
            key: "title",
            dataIndex: "title",
          },
          {
            key: "detail",
            type: "expand-detail",
          },
        ]}
        rows={categories.map((category) => {
          return { ...category, key: category._id };
        })}
      />
    </div>
  ) : (
    <Loading />
  );
}

export default Index;
