import express from "express";
const router = express.Router();
import { isLoggedIn } from "src/api/middleware/auth";

import * as settings from "src/api/controllers/settings";

router.get("/", isLoggedIn, settings.find);
router.patch("/", isLoggedIn, settings.update);

router.get("/options", isLoggedIn, settings.options);

export default router;
