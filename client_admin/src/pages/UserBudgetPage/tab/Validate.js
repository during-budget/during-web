import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import useAPI from "../../../hooks/useAPI";
import Table from "../../../components/Table";
import Detail from "../../../components/Detail";
import Loading from "../../../components/Loading";

import { Button, Radio, Result, Tag } from "antd";

function Index() {
  const navigate = useNavigate();
  const { budgetId } = useParams();
  const API = useAPI();

  const [isValid, setIsValid] = useState(false);
  const [itemsInvalid, setItemsInvalid] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const validate = async () => {
    const {
      budget,
      invalid,
      b,
      amountPlanned,
      amountScheduled,
      amountCurrent,
    } = await API.GET({
      location: "budgets/" + budgetId + "/validate",
    });
    setIsValid(invalid.length === 0);
    setItemsInvalid(
      invalid.map((val) => {
        if (!val.category) {
          val.type = "budget";
          val.valid = b[val.field];
          val.exVal = budget[val.field];

          val.categoryId = "";
        } else {
          val.type = "category";
          val.categoryId = val.category.categoryId;
          val._category = `${val.category.icon}/${val.category.title}`;
          if (val.field === "amountPlanned") {
            val.valid = amountPlanned[val.category.categoryId];
            val.exVal = val.category.amountPlanned;
          } else if (val.field === "amountScheduled") {
            val.valid = amountScheduled[val.category.categoryId];
            val.exVal = val.category.amountScheduled;
          } else {
            val.valid = amountCurrent[val.category.categoryId];
            val.exVal = val.category.amountCurrent;
          }
        }
        val.fix = "action";
        return val;
      })
    );
  };

  const fix = async (data) => {
    await API.PUT({
      location: "budgets/" + budgetId + "/fix",
      data,
    });
    setIsLoading(true);
  };

  useEffect(() => {
    if (isLoading) {
      validate()
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
    !isValid ? (
      <div>
        <Table
          columns={[
            {
              key: "type",
              width: "112px",
              render: (e) =>
                e === "budget" ? (
                  <Tag color={"orange"}>BUDGET</Tag>
                ) : (
                  <Tag color={"cyan"}>CATEGORY</Tag>
                ),
            },
            {
              key: "category",
              dataIndex: "_category",
              width: "112px",
            },
            {
              key: "description",
              render: (e, row) => {
                return (
                  <div>
                    <Tag>{row.field}</Tag> should be{" "}
                    <Tag color={"blue"}>{row.valid}</Tag>, but it is{" "}
                    <Tag color={"red"}>{row.exVal}</Tag>
                  </div>
                );
              },
            },
            {
              key: "fix",
              width: "112px",
              render: (e, item) => {
                return (
                  <Button
                    type="primary"
                    onClick={() => {
                      fix({
                        categoryId: item.categoryId,
                        key: item.field,
                        amount: parseInt(item.valid),
                      }).then(() => {
                        setIsLoading(true);
                      });
                    }}
                  >
                    fix
                  </Button>
                );
              },
            },
          ]}
          rows={itemsInvalid.map((v, i) => {
            return { ...v, key: String(i) };
          })}
        />
      </div>
    ) : (
      <Result
        status="success"
        title="Budget is valid!"
        extra={[
          <Button
            key="retry"
            onClick={(e) => {
              setIsLoading(true);
            }}
          >
            Validate Again
          </Button>,
        ]}
      />
    )
  ) : (
    <Loading />
  );
}

export default Index;
