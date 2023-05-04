import { HomeOutlined } from "@ant-design/icons";
import { Breadcrumb } from "antd";
import React from "react";
import { useLocation } from "react-router-dom";

const Navbar = () => {
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

  return <Breadcrumb items={items} />;
};

export default Navbar;
