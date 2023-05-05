import React from "react";
import Tabs from "../../components/Tabs";

import BasicInfo from "./tab/BasicInfo";
import Categories from "./tab/Categories";
import TransactionList from "./tab/TransactionList";
// import Validate from "./tab/Validate";

function Index() {
  return (
    <div style={{ marginTop: "24px" }}>
      <Tabs
        items={[
          { label: "info", child: <BasicInfo /> },
          { label: "categories", child: <Categories /> },
          { label: "transactions", child: <TransactionList /> },
          { label: "validate", child: <div /> },
        ]}
      />
    </div>
  );
}

export default Index;
