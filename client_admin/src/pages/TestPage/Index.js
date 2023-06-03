import React from "react";
import Tabs from "../../components/Tabs";

import { Result } from "antd";

import Email from "./tab/email";

const NotReady = () => {
  return <Result title="Page is not ready" />;
};

function Index() {
  return (
    <div style={{ marginTop: "24px" }}>
      <Tabs
        items={[
          { label: "email", child: <Email /> },
          { label: "undefined", child: <NotReady /> },
        ]}
      />
    </div>
  );
}

export default Index;
