import React from "react";
import Tabs from "../../components/Tabs";

import { Result } from "antd";

import SnsId from "./tab/snsId";

const NotReady = () => {
  return <Result title="Page is not ready" />;
};

function Index() {
  return (
    <div style={{ marginTop: "24px" }}>
      <Tabs
        items={[
          { label: "snsId", child: <SnsId /> },
          { label: "undefined", child: <NotReady /> },
        ]}
      />
    </div>
  );
}

export default Index;
