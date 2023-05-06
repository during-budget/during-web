import React, { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import Navbar from "../components/Navbar";
// pages for this product
import LandingPage from "./LandingPage/Index.js";
import LogInPage from "./LogInPage/Index.js";
import UserList from "./UserPage/List.js";
import UserPage from "./UserPage/Index.js";
import UBudgetList from "./UserBudgetPage/List.js";
import UBudgetPage from "./UserBudgetPage/Index.js";

import BudgetList from "./BudgetPage/List.js";
import BudgetPage from "./BudgetPage/Index.js";
import TransactionList from "./TransactionPage/List.js";

import LogList from "./LogPage/List.js";

import useAPI from "../hooks/useAPI";
import useStore from "../hooks/useStore";

function App() {
  const API = useAPI();
  const { user, logIn, logOut } = useStore((state) => state);

  API.GET({ location: "users/current" }, (user, error) => {
    if (error) {
      alert("ERROR!");
      logOut();
      return;
    }

    if (user) logIn(user);
    else logOut();
  });

  const RouteUser = (path, child) => (
    <Route
      exact
      path={path}
      element={user ? child : <Navigate to="/login" />}
    />
  );

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div style={{ paddingTop: "20px", minHeight: "100px", padding: "50px" }}>
        <Navbar />
        <Routes>
          {RouteUser("/", <LandingPage />)}
          <Route
            exact
            path="/login"
            element={!user ? <LogInPage /> : <Navigate to="/" />}
          />
          {RouteUser("/DB", <Navigate to="/DB/users" />)}
          {RouteUser("/DB/users", <UserList />)}
          {RouteUser("/DB/users/:_id", <UserPage />)}
          {RouteUser("/DB/users/:_id/budgets", <UBudgetList />)}
          {RouteUser("/DB/users/:_id/budgets/:budgetId", <UBudgetPage />)}
          {RouteUser("/DB/budgets", <BudgetList />)}
          {RouteUser("/DB/budgets/:budgetId", <BudgetPage />)}
          {RouteUser("/DB/transactions", <TransactionList />)}
          {RouteUser("/logs", <LogList />)}
          <Route path="*" element={<Navigate to="/" />}></Route>
        </Routes>
      </div>
    </Suspense>
  );
}

export default App;