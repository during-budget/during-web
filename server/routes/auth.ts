import express from "express";
const router = express.Router();
import { isLoggedIn } from "../middleware/auth";
import * as auth from "../controllers/auth";
import passport from "passport";

router.get("/", isLoggedIn, auth.find);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);
router.get("/google/callback", auth.google);
router.delete("/google", isLoggedIn, auth.disconnectGoogle);

router.get("/naver", passport.authenticate("naver"));
router.get("/naver/callback", auth.naver);
router.delete("/naver", isLoggedIn, auth.disconnectNaver);

router.get("/kakao", passport.authenticate("kakao"));
router.get("/kakao/callback", auth.kakao);
router.delete("/kakao", isLoggedIn, auth.disconnectKakao);

module.exports = router;
