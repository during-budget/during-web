import express from "express";
const router = express.Router();
import { isLoggedIn, isPortOneWebHook, isAdmin } from "src/api/middleware/auth";

import * as payments from "src/api/controllers/payments";

router.post("/prepare", isLoggedIn, payments.prepare);
router.post("/complete", isLoggedIn, payments.completeByUser);
router.post("/complete/webhook", isPortOneWebHook, payments.completeByWebhook);

router.get("/", isLoggedIn, payments.find);

router.delete("/:_id", isAdmin, payments.remove);

export default router;
