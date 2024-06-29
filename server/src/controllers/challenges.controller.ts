import express from "express";
const router = express.Router();
import { isLoggedIn } from "src/middleware/auth";

import * as challenges from "src/controllers/challenges.controller1";
import { wrapAsync } from "../middleware/error";

router.post("/", isLoggedIn, wrapAsync(challenges.create));
router.get("/", isLoggedIn, wrapAsync(challenges.find));

router.delete("/:_id", isLoggedIn, wrapAsync(challenges.remove));

export default router;
