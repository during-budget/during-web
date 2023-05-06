const routers = [
  "users",
  "budgets",
  "transactions",
  "categories",
  "assets",
  "cards",
  "paymentMethods",
  "snsId",
];

if (process.env.NODE_ENV?.trim() == "development") {
  routers.push("test");
}

export { routers };
