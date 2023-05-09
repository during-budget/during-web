import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import useAPI from "../../hooks/useAPI";
import Table from "../../components/Table";
import HeaderRefresh from "../../components/HeaderRefresh";
import Loading from "../../components/Loading";

import _ from "lodash";
import { Tag } from "antd";

function List() {
  const API = useAPI();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [userNameFilters, setUserNameFilters] = useState([]);

  const updateDocuments = async () => {
    try {
      const { users } = await API.GET({ location: "users" });

      const userNames = new Set(users.map((b) => b.userName));
      setUserNameFilters(
        _.orderBy(Array.from(userNames)).map((userName) => {
          return { text: userName, value: userName };
        })
      );

      setUsers(_.orderBy(users, ["createdAt"]));
    } catch (err) {
      alert(err.response.data?.message ?? "error!");
      console.error(err);
      navigate("/");
    }
  };

  useEffect(() => {
    if (isLoading) {
      updateDocuments().then(() => {
        setIsLoading(false);
      });
    }
    return () => {};
  }, [isLoading]);

  return !isLoading ? (
    <div style={{ marginTop: "24px" }}>
      <HeaderRefresh text="users" setIsLoading={setIsLoading} />

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
            key: "userName",
            type: "button-detail",
            onClick: (e) => {
              navigate(e._id);
            },
            sorter: (a, b) => a.userName > b.userName,
            filters: userNameFilters,
            onFilter: (value, record) => record.userName.startsWith(value),
            filterSearch: true,
          },
          {
            key: "snsId",
            render: (e) => {
              const tags = [];
              if (e?.google) tags.push(<Tag color={"grey"}>Google</Tag>);
              if (e?.naver) tags.push(<Tag color={"green"}>Naver</Tag>);
              if (e?.kakao) tags.push(<Tag color={"yellow"}>Kakao</Tag>);

              return <div>{tags}</div>;
            },
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
                  "정말 삭제하시겠습니까? budgets와 transactions가 함께 삭제됩니다."
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
    </div>
  ) : (
    <Loading />
  );
}

export default List;
