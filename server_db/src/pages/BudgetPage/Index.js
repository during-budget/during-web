import React from "react";
import Tabs from "../../components/Tabs";

import BasicInfo from "./tab/BasicInfo";
import Categories from "./tab/Categories";
import TransactionList from "./tab/TransactionList";

function Index() {
  return (
    <div>
      <Tabs
        items={{
          info: <BasicInfo />,
          categories: <Categories />,
          "transactions(expense)": <TransactionList isExpense={true} />,
          "transactions(income)": <TransactionList isIncome={true} />,
        }}
      />
    </div>
  );
}

export default Index;
