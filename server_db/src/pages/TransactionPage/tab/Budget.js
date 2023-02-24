import React from "react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import useAPI from "../../../hooks/useAPI";

function Budget() {
  const API = useAPI();
  const { _id } = useParams();
  const navigate = useNavigate();

  const findBudgetId = async () => {
    const { document } = await API.GET({
      location: "test/transactions/" + _id,
    });
    return document.budgetId;
  };

  useEffect(() => {
    findBudgetId()
      .then((budgetId) => {
        navigate(`/budgets/${budgetId}`);
      })
      .catch((err) => {
        alert(err.response.data.message);
        return navigate("/transactions");
      });
    return () => {};
  }, []);

  return <div>loading...</div>;
}

export default Budget;
