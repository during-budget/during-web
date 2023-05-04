import React from "react";
import Tabs from "../../components/Tabs";

import BasicInfo from "./tab/BasicInfo";
// import Categories from "./tab/Categories";
// import BudgetList from "./tab/BudgetList";
// import TransactionList from "./tab/TransactionList";
// import AssetsAndCards from "./tab/AssetsAndCards";
// import PaymentMethods from "./tab/PaymentMethods";

function Index() {
  return (
    <div style={{ marginTop: "24px" }}>
      <Tabs
        items={[
          { label: "info", child: <BasicInfo /> },
          { label: "budgets", child: <div>asdf</div> },
          { label: "categories", child: <div>asdf</div> },
          { label: "assets & cards", icon: "card", child: <div>asdf</div> },
          { label: "payment methods", child: <div>asdf</div> },
        ]}
      />
      {/* <Tabs
        items={{
          info: <BasicInfo />,
          categories: <Categories />,
          budgets: <BudgetList />,
          transactions: <TransactionList />,
          "assets & cards": <AssetsAndCards />,
          "payment methods": <PaymentMethods />,
        }}
      /> */}
    </div>
  );
}

export default Index;
