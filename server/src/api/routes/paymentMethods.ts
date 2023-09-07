import express from "express";
const router = express.Router();
import { isLoggedIn } from "src/api/middleware/auth";

import * as paymentMethods from "src/api/controllers/paymentMethods";
import { wrapAsync } from "../middleware/error";

router.put("/", isLoggedIn, wrapAsync(paymentMethods.update));
router.get("/", isLoggedIn, wrapAsync(paymentMethods.find));

export default router;
