import express from "express";
const router = express.Router();
import { isLoggedIn } from "../middleware/auth";
import * as snsId from "../controllers/snsId";
import passport from "passport";

router.get("/", isLoggedIn, snsId.find);

router.post("/google", isLoggedIn, snsId.connectGoogle);
router.delete("/google", isLoggedIn, snsId.disconnectGoogle);

router.get(
  "/naver",
  passport.authenticate("naverConnect", { authType: "reprompt" })
);
router.get("/naver/callback", snsId.connectNaver);
router.delete("/naver", isLoggedIn, snsId.disconnectNaver);

module.exports = router;
