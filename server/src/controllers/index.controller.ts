import users from "./users.controller";
import budgets from "./budgets.controller";
import transactions from "./transactions.controller";
import categories from "./categories.controller";
import assets from "./assets.controller";
import cards from "./cards.controller";
import paymentMethods from "./paymentMethods.controller";
import auth from "./auth.controller";
import settings from "./settings.controller";
import items from "./items.controller";
import payments from "./payments.controller";
import challenges from "./challenges.controller";
import agreements from "./agreements.controller";
import test from "./test.controller";

export default [
  { label: "users", routes: users },
  { label: "budgets", routes: budgets },
  { label: "transactions", routes: transactions },
  { label: "categories", routes: categories },
  { label: "assets", routes: assets },
  { label: "cards", routes: cards },
  { label: "paymentMethods", routes: paymentMethods },
  { label: "auth", routes: auth },
  { label: "items", routes: items },
  { label: "payments", routes: payments },
  { label: "settings", routes: settings },
  { label: "challenges", routes: challenges },
  { label: "agreements", routes: agreements },
  { label: "test", routes: test },
];
