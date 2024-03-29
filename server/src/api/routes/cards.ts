import express from "express";
const router = express.Router();
import { isLoggedIn } from "src/api/middleware/auth";

import * as cards from "src/api/controllers/cards";
import { wrapAsync } from "../middleware/error";

router.put("/", isLoggedIn, wrapAsync(cards.updateAll));
router.get("/:_id?", isLoggedIn, wrapAsync(cards.find));

router.post("/", isLoggedIn, wrapAsync(cards.create));
router.put("/:_id", isLoggedIn, wrapAsync(cards.update));
router.delete("/:_id", isLoggedIn, wrapAsync(cards.remove));

router.get(
  "/:_id/transactions",
  isLoggedIn,
  wrapAsync(cards.findCardTransactions)
);
router.post(
  "/:_id/transactions",
  isLoggedIn,
  wrapAsync(cards.createCardTransaction)
);
router.put(
  "/:_id/transactions",
  isLoggedIn,
  wrapAsync(cards.updateCardTransaction)
);
router.delete(
  "/:_id/transactions",
  isLoggedIn,
  wrapAsync(cards.removeCardTransaction)
);

export default router;
