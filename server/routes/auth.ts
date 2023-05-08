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

// router.get(
//   "/naver",
//   passport.authenticate("naverConnect", { authType: "reprompt" })
// );
// router.get("/naver/callback", auth.connectNaver);
// router.delete("/naver", isLoggedIn, auth.disconnectNaver);

// router.get("/kakao", passport.authenticate("kakaoConnect"));
// router.get("/kakao/callback", auth.connectKakao);
// router.delete("/kakao", isLoggedIn, auth.disconnectKakao);

module.exports = router;
