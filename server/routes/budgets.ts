import express from "express";
const router = express.Router();
import { isLoggedIn } from "../middleware/auth";
import * as budgets from "../controllers/budgets";

router.post("/", isLoggedIn, budgets.create);

router.post("/:_id/category", isLoggedIn, budgets.createCategory);
router.put(
  "/:_id/category/amountPlanned",
  isLoggedIn,
  budgets.updateCategoryAmountPlanned
);
router.delete("/:_id/category", isLoggedIn, budgets.removeCategory);

router.patch("/:_id", isLoggedIn, budgets.updateField);

router.get("/:_id?", isLoggedIn, budgets.find);
router.delete("/:_id", isLoggedIn, budgets.remove);

module.exports = router;
