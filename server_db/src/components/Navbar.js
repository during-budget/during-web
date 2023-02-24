import * as React from "react";
import { Button } from "@material-ui/core";
import { useLocation, useNavigate } from "react-router-dom";

export default function BasicTabs({ items }) {
  const navigate = useNavigate();
  const location = useLocation();
  const locationArr = location.pathname.split("/").filter((x) => x !== "");

  return (
    <div style={{ marginBottom: "24px" }}>
      <Button
        onClick={() => navigate("/", { replace: true })}
        style={{
          padding: "0px",
          paddingLeft: "4px",
          paddingRight: "4px",
          minWidth: "24px",
        }}
      >
        🏠
      </Button>
      {locationArr.map((value, index) => {
        let to = "";
        for (let i = 0; i < index + 1; i++) {
          to += `/${locationArr[i]}`;
        }

        return (
          <Button
            onClick={() => navigate(to, { replace: true })}
            style={{
              color: "gray",
              textDecoration: "underline",
              padding: "0px",
              paddingLeft: "4px",
              paddingRight: "4px",
            }}
          >
            {"/" + value}
          </Button>
        );
      })}
    </div>
  );
}
