import express from "express";
const router = express.Router();
import { isLoggedIn } from "../middleware/auth";

import * as cards from "../controllers/cards";

router.put("/", isLoggedIn, cards.update);
router.get("/", isLoggedIn, cards.find);

module.exports = router;
