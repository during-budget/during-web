import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import useAPI from "../../hooks/useAPI";
import StickyTable from "../../components/StickyTable";
import { Snackbar } from "@material-ui/core";
import { Alert } from "@mui/material";

function List() {
  const API = useAPI();
  const navigate = useNavigate();

  const [budgets, setBudgets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSnackbar, setShowSnackbar] = useState(false);

  const updateDocuments = async () => {
    const { documents: budgets } = await API.GET({ location: "test/budgets" });
    setBudgets(budgets);
  };

  useEffect(() => {
    if (isLoading) {
      updateDocuments().then(() => {
        setIsLoading(false);
      });
    }
    return () => {};
  }, [isLoading]);

  return (
    <div>
      <StickyTable
        onClick={(e) => {
          navigate(e._id);
        }}
        columns={[
          {
            label: "_id",
            type: "button-copy",
            width: "112px",
          },
          {
            label: "userId",
          },
          {
            label: "title",
          },
          {
            label: "createdAt",
          },
          {
            label: "삭제",
            type: "button-delete",
            onClick: async (e) => {
              if (window.confirm("정말 삭제하시겠습니까?") === true) {
                await API.DELETE({ location: "test/budgets/" + e._id });
                setIsLoading(true);
                setShowSnackbar(true);
                setTimeout(() => setShowSnackbar(false), 1000);
              }
            },
            width: "112px",
          },
        ]}
        rows={budgets}
      />
      <Snackbar
        open={showSnackbar}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Alert oseverity="success" sx={{ width: "100%" }}>
          {"deleted"}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default List;
