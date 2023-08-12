import express from "express";
const router = express.Router();
import { isLoggedIn } from "../../../middleware/auth";

import * as cards from "src/api/controllers/cards";

router.put("/", isLoggedIn, cards.updateAll);
router.get("/", isLoggedIn, cards.find);

router.post("/", isLoggedIn, cards.create);
router.put("/:_id", isLoggedIn, cards.update);
router.delete("/:_id", isLoggedIn, cards.remove);

router.get("/:_id/transactions", isLoggedIn, cards.findCardTransactions);
router.post("/:_id/transactions", isLoggedIn, cards.createCardTransaction);
router.put("/:_id/transactions", isLoggedIn, cards.updateCardTransaction);
router.delete("/:_id/transactions", isLoggedIn, cards.removeCardTransaction);

export default router;
