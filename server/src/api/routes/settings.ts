import express from "express";
const router = express.Router();
import { isLoggedIn } from "src/api/middleware/auth";

import * as settings from "src/api/controllers/settings";
import { wrapAsync } from "../middleware/error";

router.get("/", isLoggedIn, wrapAsync(settings.find));
router.patch("/", isLoggedIn, wrapAsync(settings.update));

router.get("/options", isLoggedIn, wrapAsync(settings.options));

export default router;
