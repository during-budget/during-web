import express from "express";
const router = express.Router();
import { isLoggedIn } from "../middleware/auth";
import * as transactions from "../controllers/transactions";

router.post("/", isLoggedIn, transactions.create);

router.put("/:_id", isLoggedIn, transactions.updateV2);

router.put("/:_id/category", isLoggedIn, transactions.updateCategory);
router.put("/:_id/amount", isLoggedIn, transactions.updateAmount);
router.patch("/:_id", isLoggedIn, transactions.updateField);

router.get("/:_id?", isLoggedIn, transactions.find);

router.delete("/:_id", isLoggedIn, transactions.remove);

module.exports = router;
