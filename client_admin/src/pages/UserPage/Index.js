import React from "react";
import Tabs from "../../components/Tabs";

import BasicInfo from "./tab/BasicInfo";
import Categories from "./tab/Categories";
import BudgetList from "./tab/BudgetList";
import Assets from "./tab/Assets";
import Cards from "./tab/Cards";
import PaymentMethods from "./tab/PaymentMethods";
import Payments from "./tab/Payments";
import Challenges from "./tab/Challenges";
import Settings from "./tab/Settings";

import useQueries from "../../hooks/useQueries";

function Index() {
  const query = new useQueries();
  const tabIdx = query.no ?? 0;

  return (
    <div style={{ marginTop: "24px" }}>
      <Tabs
        defaultActiveKey={tabIdx}
        items={[
          { label: "info", child: <BasicInfo /> },
          { label: "budgets", child: <BudgetList /> },
          { label: "categories", child: <Categories /> },
          { label: "assets", child: <Assets /> },
          { label: "cards", child: <Cards /> },
          { label: "payment methods", child: <PaymentMethods /> },
          { label: "payments", child: <Payments /> },
          { label: "challenges", child: <Challenges /> },
          { label: "settings", child: <Settings /> },
        ]}
      />
    </div>
  );
}

export default Index;
