import React, { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import Navbar from "../components/Navbar";
// pages for this product
import LandingPage from "./LandingPage/Index.js";
import LogInPage from "./LogInPage/Index.js";
import UserList from "./UserPage/List.js";
// import UserPage from "./UserPage/Index.js";
// import BudgetList from "./BudgetPage/List.js";
// import BudgetPage from "./BudgetPage/Index.js";
// import TransactionList from "./TransactionPage/List.js";
// import TransactionPage from "./TransactionPage/Index.js";

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

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div style={{ paddingTop: "20px", minHeight: "100px", padding: "50px" }}>
        <Navbar />
        <Routes>
          <Route
            exact
            path="/"
            element={user ? <LandingPage /> : <Navigate to="/login" />}
          />
          <Route
            exact
            path="/login"
            element={!user ? <LogInPage /> : <Navigate to="/" />}
          />
          <Route
            exact
            path="/DB"
            element={
              user ? <Navigate to="/DB/users" /> : <Navigate to="/login" />
            }
          />
          <Route
            exact
            path="/DB/users"
            element={user ? <UserList /> : <Navigate to="/login" />}
          />
          {/*<Route exact path="/users/:_id" element={<UserPage />} />
          <Route exact path="/budgets" element={<BudgetList />} />
          <Route exact path="/budgets/:_id" element={<BudgetPage />} />
          <Route exact path="/transactions" element={<TransactionList />} />
          <Route
            exact
            path="/transactions/:_id"
            element={<TransactionPage />}
          /> */}
        </Routes>
      </div>
    </Suspense>
  );
}

export default App;
