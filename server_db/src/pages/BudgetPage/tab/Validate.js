import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import useAPI from "../../../hooks/useAPI";
import StickyHeadTable from "../../../components/StickyTable";

function Index() {
  const navigate = useNavigate();
  const { _id } = useParams();
  const API = useAPI();

  const [invalid, setInvalid] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const validate = async () => {
    const { invalid, b, amountPlanned, amountScheduled, amountCurrent } =
      await API.GET({
        location: "budgets/" + _id + "/validate",
      });
    setInvalid(
      invalid.map((val) => {
        if (!val.category) {
          val.categoryId = "";
          val.valid = b[val.field];
        } else {
          val.categoryId = val.category.categoryId;
          if (val.field === "amountPlanned") {
            val.valid = amountPlanned[val.category.categoryId];
          } else if (val.field === "amountScheduled") {
            val.valid = amountScheduled[val.category.categoryId];
          } else {
            val.valid = amountCurrent[val.category.categoryId];
          }
        }
        val.fix = "action";
        return val;
      })
    );
  };

  const fix = async (data) => {
    const { budget } = await API.PUT({
      location: "budgets/" + _id + "/fix",
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
          return navigate("/budgets");
        });
    }
    return () => {};
  }, [isLoading]);

  return !isLoading ? (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <div>Invalid values</div>
        <StickyHeadTable
          columns={[
            {
              label: "categoryId",
            },
            {
              label: "field",
            },
            {
              label: "valid",
            },
            {
              label: "fix",
              onClick: (e) => {
                fix({
                  categoryId: e.categoryId,
                  key: e.field,
                  amount: parseInt(e.valid),
                }).then(() => {
                  setIsLoading(true);
                });
              },
            },
          ]}
          rows={invalid}
        />
      </div>
    </div>
  ) : (
    <div>loading...</div>
  );
}

export default Index;
