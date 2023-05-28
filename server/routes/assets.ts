import express from "express";
const router = express.Router();
import { isLoggedIn } from "../middleware/auth";

import * as assets from "@controllers/assets";

router.put("/", isLoggedIn, assets.updateAll);
router.get("/", isLoggedIn, assets.find);

router.post("/", isLoggedIn, assets.create);
router.put("/:_id", isLoggedIn, assets.update);
router.delete("/:_id", isLoggedIn, assets.remove);

export default router;
