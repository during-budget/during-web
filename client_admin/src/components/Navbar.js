import { HomeOutlined } from "@ant-design/icons";
import { Breadcrumb, Button } from "antd";
import React from "react";
import { useLocation } from "react-router-dom";
import useStore from "../hooks/useStore";

const Navbar = () => {
  const { user, logIn, logOut } = useStore((state) => state);

  const location = useLocation();
  const locationArr = location.pathname.split("/").filter((x) => x !== "");

  const items = [
    {
      href: "/",
      title: <HomeOutlined />,
    },
  ];
  let href = "";
  for (let loc of locationArr) {
    href = href + "/" + loc;
    items.push({
      href,
      title: loc,
    });
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
        <Button type="link" onClick={() => logOut()}>
          logout
        </Button>
      ) : (
        <Button type="link" onClick={() => logIn({ _id: "asdf" })}>
          login
        </Button>
      )}
    </div>
  );
};

export default Navbar;
