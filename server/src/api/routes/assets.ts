import express from "express";
const router = express.Router();
import { isLoggedIn } from "src/api/middleware/auth";

import * as assets from "src/api/controllers/assets";
import { wrapAsync } from "../middleware/error";

router.put("/", isLoggedIn, wrapAsync(assets.updateAll));
router.get("/:_id?", isLoggedIn, wrapAsync(assets.find));

router.post("/", isLoggedIn, wrapAsync(assets.create));
router.put("/:_id", isLoggedIn, wrapAsync(assets.update));
router.delete("/:_id", isLoggedIn, wrapAsync(assets.remove));

export default router;
