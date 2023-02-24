import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TextField } from "@material-ui/core";

import useAPI from "../../../hooks/useAPI";

function Index() {
  const API = useAPI();
  const { _id } = useParams();
  const [budget, setBudget] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const updateData = async () => {
    const { document } = await API.GET({ location: "test/budgets/" + _id });
    setBudget(document);
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
      <div style={{ display: "flex", gap: "24px", flexDirection: "column" }}>
        {Object.keys(budget).map((key, idx) => (
          <TextField
            id={`outlined-read-only-input-${idx}`}
            label={key}
            defaultValue={budget[key]}
            InputProps={{
              readOnly: true,
            }}
          />
        ))}
      </div>
    </div>
  ) : (
    <div>loading...</div>
  );
}

export default Index;
