import express from "express";
const router = express.Router();
import { isLoggedIn } from "../../../middleware/auth";

import * as paymentMethods from "src/api/controllers/paymentMethods";

router.put("/", isLoggedIn, paymentMethods.update);
router.get("/", isLoggedIn, paymentMethods.find);

export default router;
