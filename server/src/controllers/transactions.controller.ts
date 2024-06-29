import express from "express";
const router = express.Router();
import { isLoggedIn } from "src/middleware/auth";
import * as transactions from "src/controllers/transactions.controller1";
import { wrapAsync } from "../middleware/error";

router.post("/", isLoggedIn, wrapAsync(transactions.create));

router.put("/:_id", isLoggedIn, wrapAsync(transactions.updateV2));

router.get("/:_id?", isLoggedIn, wrapAsync(transactions.find));

router.delete("/:_id", isLoggedIn, wrapAsync(transactions.remove));

export default router;
