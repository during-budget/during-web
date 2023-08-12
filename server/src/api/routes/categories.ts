import express from "express";
const router = express.Router();
import { isLoggedIn } from "../../../middleware/auth";

import * as categories from "src/api/controllers/categories";

router.put("/", isLoggedIn, categories.updateV2);

router.patch("/", isLoggedIn, categories.updateV3);

router.get("/", isLoggedIn, categories.find);

router.post("/", isLoggedIn, categories.create);

router.get("/:_id", isLoggedIn, categories.findOne);

router.put("/:_id", isLoggedIn, categories.update);

router.delete("/:_id", isLoggedIn, categories.remove);

export default router;
