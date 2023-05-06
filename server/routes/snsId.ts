import express from "express";
const router = express.Router();
import { isLoggedIn } from "../middleware/auth";
import * as snsId from "../controllers/snsId";

router.get("/", isLoggedIn, snsId.find);

router.post("/google", isLoggedIn, snsId.connectGoogle);
router.delete("/google", isLoggedIn, snsId.disconnectGoogle);

module.exports = router;
