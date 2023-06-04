import express from "express";
const router = express.Router();
import { isLoggedIn, isPortOneWebHook } from "../middleware/auth";

import * as payments from "@controllers/payments";

router.post("/prepare", isLoggedIn, payments.prepare);
router.post("/complete", isLoggedIn, payments.completeByUser);
router.post("/complete/webhook", isPortOneWebHook, payments.completeByWebhook);

router.get("/", isLoggedIn, payments.find);

export default router;
