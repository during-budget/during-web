import express from "express";
const router = express.Router();
import { isLoggedIn } from "src/api/middleware/auth";
import * as budgets from "src/api/controllers/budgets";
import { wrapAsync } from "../middleware/error";

router.post("/basic", isLoggedIn, wrapAsync(budgets.createWithBasic));

router.patch(
  "/:_id/categories",
  isLoggedIn,
  wrapAsync(budgets.updateCategoriesV3)
);

router.put(
  "/:_id/categories/:categoryId/amountPlanned",
  isLoggedIn,
  wrapAsync(budgets.updateCategoryAmountPlanned)
);

router.patch("/:_id", isLoggedIn, budgets.updateField);

router.get("/:_id?", isLoggedIn, wrapAsync(budgets.find));

router.delete("/:_id", isLoggedIn, wrapAsync(budgets.remove));

export default router;
