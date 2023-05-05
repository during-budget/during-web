import React, { useEffect } from "react";

import { useNavigate } from "react-router-dom";

import _ from "lodash";

function Index() {
  const navigate = useNavigate();
  useEffect(() => {
    const tokens = _.split(window.location.pathname, "/");
    let path = "";
    for (let i = 1; i < tokens.length - 1; i++) {
      path = path + "/" + tokens[i];
    }
    path = path + "?no=1";
    navigate(path, {
      replace: true,
    });

    return () => {};
  }, []);

  return <div style={{ marginTop: "24px" }}></div>;
}

export default Index;
