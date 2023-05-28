import express from "express";
const router = express.Router();
import { isLoggedIn } from "../middleware/auth";

import * as categories from "../controllers/categories";

router.put("/", isLoggedIn, categories.updateV2);

router.patch("/", isLoggedIn, categories.updateV3);

router.get("/", isLoggedIn, categories.find);

export default router;
