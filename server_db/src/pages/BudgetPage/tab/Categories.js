import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FormControlLabel, Radio, RadioGroup } from "@material-ui/core";

import useAPI from "../../../hooks/useAPI";
import StickyHeadTable from "../../../components/StickyTable";

function Index() {
  const navigate = useNavigate();
  const { _id } = useParams();
  const API = useAPI();

  const [budget, setBudget] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryType, setCategoryType] = useState("isExpense");

  const [isLoading, setIsLoading] = useState(true);

  const updateData = async () => {
    const { document: budget } = await API.GET({
      location: "test/budgets/" + _id,
    });
    setBudget(budget);
    setCategories(budget.categories.filter((category) => category.isExpense));
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
      <div>
        <div style={{ marginBottom: "24px" }}>
          <RadioGroup
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            row
            value={categoryType}
            onChange={(e) => {
              setCategoryType(e.target.value);
              if (e.target.value === "all") {
                setCategories(budget.categories);
              } else if (e.target.value === "isExpense") {
                setCategories(
                  budget.categories.filter((category) => category.isExpense)
                );
              } else if (e.target.value === "isIncome") {
                setCategories(
                  budget.categories.filter((category) => category.isIncome)
                );
              } else {
                setCategories(
                  budget.categories.filter(
                    (category) => category.isExpense && category.isIncome
                  )
                );
              }
            }}
          >
            <FormControlLabel value="all" control={<Radio />} label="all" />
            <FormControlLabel
              value="isExpense"
              control={<Radio />}
              label="isExpense"
            />
            <FormControlLabel
              value="isIncome"
              control={<Radio />}
              label="isIncome"
            />
            <FormControlLabel
              value="isBoth"
              control={<Radio />}
              label="isExpense && isIncome"
            />
          </RadioGroup>
        </div>
        <StickyHeadTable
          columns={[
            {
              label: "categoryId",
              type: "button-copy",
              width: "112px",
            },
            {
              label: "isExpense",
              type: "boolean",
              width: "56px",
            },
            {
              label: "isIncome",
              type: "boolean",
              width: "56px",
            },
            {
              label: "icon",
            },
            {
              label: "title",
            },
            {
              label: "amountPlanned",
            },
            {
              label: "amountScheduled",
              onClick: () => {
                alert("hi!");
              },
            },
            {
              label: "amountCurrent",
            },
          ]}
          rows={categories}
        />
      </div>
    </div>
  ) : (
    <div>loading...</div>
  );
}

export default Index;
