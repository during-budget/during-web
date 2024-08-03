import users from "./users";
import budgets from "./budgets";
import transactions from "./transactions";
import categories from "./categories";
import assets from "./assets";
import cards from "./cards";
import paymentMethods from "./paymentMethods";
import auth from "./auth";
import settings from "./settings";
import items from "./items";
import payments from "./payments";
import challenges from "./challenges";
import agreements from "./agreements";
import test from "./test";
import backups from "./backup.controller";
import migrationRouter from "./migration.router";
import developRouter from "./develop.controller";

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
  { label: "backups", routes: backups },
  { label: "migrations", routes: migrationRouter },
  { label: "develop", routes: developRouter },
];
