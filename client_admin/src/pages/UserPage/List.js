import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import useAPI from "../../hooks/useAPI";
import Table from "../../components/Table";
import RefreshButton from "../../components/RefreshButton";

import _ from "lodash";

function List() {
  const API = useAPI();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const updateDocuments = async () => {
    const { users } = await API.GET({ location: "users" });

    setUsers(_.orderBy(users, ["createdAt"]));
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
    <div style={{ marginTop: "24px" }}>
      <RefreshButton text="users" setIsLoading={setIsLoading} />

      <Table
        columns={[
          {
            key: "_id",
            type: "button-copy",
            width: "112px",
          },
          {
            key: "email",
            dataIndex: "email",
            type: "button-detail",
            onClick: (e) => {
              navigate(e._id);
            },
            sorter: (a, b) => a.email > b.email,
            filters: users.map((user) => {
              return { text: user.email, value: user.email };
            }),
            onFilter: (value, record) => record.email.startsWith(value),
            filterSearch: true,
          },
          {
            key: "createdAt",
            defaultSortOrder: "descend",
            sorter: (a, b) => a.createdAt > b.createdAt,
          },
          {
            key: "updatedAt",
            sorter: (a, b) => a.updatedAt > b.updatedAt,
          },

          {
            key: "delete",
            type: "button-delete",
            onClick: async (e) => {
              if (
                window.confirm(
                  "정말 삭제하시겠습니까? budgets와 transactions가 함께 삭제합니다."
                ) === true
              ) {
                await API.DELETE({ location: "users/" + e._id });
                setIsLoading(true);
                alert("success");
              }
            },
            width: "112px",
          },
        ]}
        rows={users}
      />
      {/* <Snackbar
        open={showSnackbar}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Alert oseverity="success" sx={{ width: "100%" }}>
          {"deleted"}
        </Alert>
      </Snackbar> */}
    </div>
  );
}

export default List;
