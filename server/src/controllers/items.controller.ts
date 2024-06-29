import express from "express";
const router = express.Router();
import { isAdmin, isLoggedIn } from "src/middleware/auth";

import * as items from "src/controllers/items.controller1";
import { wrapAsync } from "../middleware/error";

router.post("/", isAdmin, wrapAsync(items.create));
router.get("/", isLoggedIn, wrapAsync(items.find));
router.put("/:_id", isAdmin, wrapAsync(items.update));
router.delete("/:_id", isAdmin, wrapAsync(items.remove));

export default router;
