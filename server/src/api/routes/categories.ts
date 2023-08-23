import express from "express";
const router = express.Router();
import { isLoggedIn } from "src/api/middleware/auth";

import * as categories from "src/api/controllers/categories";
import { wrapAsync } from "../middleware/error";

router.put("/", isLoggedIn, wrapAsync(categories.updateAll));

router.patch("/", isLoggedIn, wrapAsync(categories.updatePartially));

router.get("/", isLoggedIn, wrapAsync(categories.find));

router.post("/", isLoggedIn, wrapAsync(categories.create));

router.get("/:_id", isLoggedIn, wrapAsync(categories.findOne));

router.put("/:_id", isLoggedIn, wrapAsync(categories.update));

router.delete("/:_id", isLoggedIn, wrapAsync(categories.remove));

export default router;
