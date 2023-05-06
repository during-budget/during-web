import express from "express";
const router = express.Router();
import { isLoggedIn } from "../middleware/auth";

import * as cards from "../controllers/cards";

router.put("/", isLoggedIn, cards.updateAll);
router.get("/", isLoggedIn, cards.find);

router.post("/", isLoggedIn, cards.create);
router.put("/:_id", isLoggedIn, cards.update);
router.delete("/:_id", isLoggedIn, cards.remove);

module.exports = router;
