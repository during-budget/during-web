import express from "express";
const router = express.Router();
import { isLoggedIn, isPortOneWebHook, isAdmin } from "src/middleware/auth";

import * as payments from "src/controllers/payments.controller1";
import { wrapAsync } from "../middleware/error";

router.post("/prepare", isLoggedIn, wrapAsync(payments.prepare));
router.post("/complete", isLoggedIn, wrapAsync(payments.completeByUser));
router.post(
  "/complete/webhook",
  isPortOneWebHook,
  wrapAsync(payments.completeByWebhook)
);

router.get("/", isLoggedIn, wrapAsync(payments.find));

router.delete("/:_id", isAdmin, wrapAsync(payments.remove));

export default router;
