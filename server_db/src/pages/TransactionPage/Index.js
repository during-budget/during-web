import React from "react";
import Tabs from "../../components/Tabs";

import BasicInfo from "./tab/BasicInfo";
import Budget from "./tab/Budget";
import User from "./tab/User";

function Index() {
  return (
    <div>
      <Tabs
        items={{
          info: <BasicInfo />,
          "Budget↗": <Budget />,
          "User↗": <User />,
        }}
      />
    </div>
  );
}

export default Index;
