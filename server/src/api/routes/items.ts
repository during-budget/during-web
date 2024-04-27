import express from "express";
const router = express.Router();
import { isAdmin, isLoggedIn } from "src/api/middleware/auth";

import * as items from "src/api/controllers/items";
import { wrapAsync } from "../middleware/error";

router.post("/", isAdmin, wrapAsync(items.create));
router.get("/", isLoggedIn, wrapAsync(items.find));
router.get("/availability", isLoggedIn, wrapAsync(items.isItemAvailable));
router.put("/:_id", isAdmin, wrapAsync(items.update));
router.delete("/:_id", isAdmin, wrapAsync(items.remove));

export default router;
