import express from "express";
const router = express.Router();
import { isLoggedIn } from "../middleware/auth";

import * as assets from "../controllers/assets";

router.put("/", isLoggedIn, assets.update);
router.get("/", isLoggedIn, assets.find);

module.exports = router;
