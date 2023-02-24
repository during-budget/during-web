import React from "react";
import Tabs from "../../components/Tabs";

import BasicInfo from "./tab/BasicInfo";
import Categories from "./tab/Categories";
import BudgetList from "./tab/BudgetList";
import TransactionList from "./tab/TransactionList";

function Index() {
  return (
    <div>
      <Tabs
        items={{
          info: <BasicInfo />,
          categories: <Categories />,
          budgets: <BudgetList />,
          transactions: <TransactionList />,
        }}
      />
    </div>
  );
}

export default Index;
