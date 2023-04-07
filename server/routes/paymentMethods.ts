import express from "express";
const router = express.Router();
import { isLoggedIn } from "../middleware/auth";

import * as paymentMethods from "../controllers/paymentMethods";

router.put("/", isLoggedIn, paymentMethods.update);
router.get("/", isLoggedIn, paymentMethods.find);

module.exports = router;
