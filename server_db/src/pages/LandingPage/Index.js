import { Button } from "@material-ui/core";
import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Index() {
  const navigate = useNavigate();
  const locationArr = ["users", "budgets", "transactions"];

  useEffect(() => {
    // navigate("/users");
    return () => {};
  }, []);

  return (
    <div>
      <div style={{ display: "flex", gap: "24px", flexDirection: "column" }}>
        {locationArr.map((value, index) => {
          return (
            <Button
              onClick={() => navigate(`/${value}`, { replace: true })}
              variant="outlined"
              color="primary"
              style={{
                textDecoration: "underline",
              }}
            >
              {"/" + value}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

export default Index;
