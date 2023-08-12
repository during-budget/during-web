import express from "express";
const router = express.Router();
import { isLoggedIn } from "src/api/middleware/auth";

import * as challenges from "src/api/controllers/challenges";

router.post("/", isLoggedIn, challenges.create);
router.get("/", isLoggedIn, challenges.find);

export default router;
