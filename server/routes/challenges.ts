import express from "express";
const router = express.Router();
import { isLoggedIn } from "../middleware/auth";

import * as challenges from "@controllers/challenges";

router.post("/", isLoggedIn, challenges.create);
router.get("/", isLoggedIn, challenges.find);

export default router;
