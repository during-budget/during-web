import express from "express";
const router = express.Router();
import { isAdmin, isLoggedIn } from "../../../middleware/auth";

import * as items from "src/api/controllers/items";

router.post("/", isAdmin, items.create);
router.get("/", isLoggedIn, items.find);
router.put("/:_id", isAdmin, items.update);
router.delete("/:_id", isAdmin, items.remove);

export default router;
