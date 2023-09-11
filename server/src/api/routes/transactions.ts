import express from "express";
const router = express.Router();
import { isLoggedIn } from "src/api/middleware/auth";
import * as transactions from "src/api/controllers/transactions";
import { wrapAsync } from "../middleware/error";

router.post("/", isLoggedIn, wrapAsync(transactions.create));

router.put("/:_id", isLoggedIn, wrapAsync(transactions.updateV2));

router.get("/:_id?", isLoggedIn, transactions.find);

router.delete("/:_id", isLoggedIn, transactions.remove);

export default router;
