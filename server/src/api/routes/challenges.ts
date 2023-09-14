import express from "express";
const router = express.Router();
import { isLoggedIn } from "src/api/middleware/auth";

import * as challenges from "src/api/controllers/challenges";
import { wrapAsync } from "../middleware/error";

router.post("/", isLoggedIn, wrapAsync(challenges.create));
router.get("/", isLoggedIn, wrapAsync(challenges.find));

router.delete("/:_id", isLoggedIn, wrapAsync(challenges.remove));

export default router;
