import { HomeOutlined } from "@ant-design/icons";
import { Breadcrumb, Button } from "antd";
import React from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import useStore from "../hooks/useStore";
import useAPI from "../hooks/useAPI";

const Navbar = () => {
  const { user, logOut } = useStore((state) => state);

  const API = useAPI();
  const location = useLocation();
  const locationArr = location.pathname.split("/").filter((x) => x !== "");
  const navigate = useNavigate();

  const items = [
    {
      href: "/",
      title: <HomeOutlined />,
    },
  ];

  if (locationArr.length > 0) {
    if (locationArr[0] === "DB") {
      let href = "/DB";
      items.push({
        href,
        title: "DB",
      });

      if (locationArr.length > 1) {
        href = href + "/" + locationArr[1];
        items.push({
          href,
          title: locationArr[1],
          menu: {
            items: [
              {
                title: "users",
                onClick: () => {
                  navigate("/DB/users");
                },
              },
              {
                title: "budgets",
                onClick: () => {
                  navigate("/DB/budgets");
                },
              },
              {
                title: "transactions",
                onClick: () => {
                  navigate("/DB/transactions");
                },
              },
            ],
          },
        });

        for (let i = 2; i < locationArr.length; i++) {
          href = href + "/" + locationArr[i];
          items.push({
            href,
            title: locationArr[i],
          });
        }
      }
    } else if (locationArr[0] === "logs") {
      let href = "";
      for (let i = 0; i < locationArr.length; i++) {
        href = href + "/" + locationArr[i];
        items.push({
          href,
          title: locationArr[i],
        });
      }
    }
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Breadcrumb items={items} />
      {user ? (
        <div>
          {user.email ?? user.userName}
          <Button
            type="link"
            onClick={async () => {
              await API.GET({ location: "users/logout" });
              logOut();
            }}
          >
            logout
          </Button>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Navbar;
