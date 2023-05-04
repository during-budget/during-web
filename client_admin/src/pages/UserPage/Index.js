import React from "react";
import Tabs from "../../components/Tabs";

import BasicInfo from "./tab/BasicInfo";
import Categories from "./tab/Categories";
// import BudgetList from "./tab/BudgetList";
import Assets from "./tab/Assets";
import Cards from "./tab/Cards";
import PaymentMethods from "./tab/PaymentMethods";

function Index() {
  return (
    <div style={{ marginTop: "24px" }}>
      <Tabs
        items={[
          { label: "info", child: <BasicInfo /> },
          { label: "budgets", child: <div>asdf</div> },
          { label: "categories", child: <Categories /> },
          { label: "assets", child: <Assets /> },
          { label: "cards", child: <Cards /> },
          { label: "payment methods", child: <PaymentMethods /> },
        ]}
      />
    </div>
  );
}

export default Index;
