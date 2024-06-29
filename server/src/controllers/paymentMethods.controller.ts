import express from "express";
const router = express.Router();
import { isLoggedIn } from "src/middleware/auth";

import * as paymentMethods from "src/controllers/paymentMethods.controller1";
import { wrapAsync } from "../middleware/error";

router.put("/", isLoggedIn, wrapAsync(paymentMethods.update));
router.get("/", isLoggedIn, wrapAsync(paymentMethods.find));

export default router;
