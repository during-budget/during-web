import express from "express";
const router = express.Router();
import { isLoggedIn } from "../middleware/auth";
import * as budgets from "../controllers/budgets";

router.get("/:_id/validate", budgets.validate);
router.put("/:_id/fix", budgets.fix);

router.post("/", isLoggedIn, budgets.create);
router.post("/basic", isLoggedIn, budgets.createWithBasic);

router.patch("/:_id/categories", isLoggedIn, budgets.updateCategoriesV3);
router.put(
  "/:_id/categories/:categoryId/amountPlanned",
  isLoggedIn,
  budgets.updateCategoryAmountPlanned
);

router.patch("/:_id", isLoggedIn, budgets.updateField);

router.get("/:_id?", isLoggedIn, budgets.find);
router.delete("/:_id", isLoggedIn, budgets.remove);

module.exports = router;
