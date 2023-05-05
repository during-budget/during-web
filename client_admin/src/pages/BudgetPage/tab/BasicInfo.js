import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import useAPI from "../../../hooks/useAPI";

import Detail from "../../../components/Detail";

function Index() {
  const API = useAPI();
  const { budgetId } = useParams();
  const [budget, setBudget] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const updateData = async () => {
    const { budget } = await API.GET({ location: "budgets/" + budgetId });
    setBudget(budget);
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
    Detail(budget, { marginLeft: "0px", marginRight: "0px" })
  ) : (
    <div>loading...</div>
  );
}

export default Index;
