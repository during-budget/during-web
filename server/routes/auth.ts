import express from "express";
const router = express.Router();
import { isLoggedIn, isNotLoggedIn } from "../middleware/auth";
import * as auth from "../controllers/auth";
import passport from "passport";

router.get("/", isLoggedIn, auth.find);

router.get(
  "/google/admin",
  isNotLoggedIn,
  passport.authenticate("googleAdmin", {
    scope: ["profile"],
  })
);
router.get("/google/admin/callback", auth.callbackAdmin);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get("/naver", passport.authenticate("naver"));
router.get("/kakao", passport.authenticate("kakao"));

router.get("/:provider/callback", auth.callback);

router.delete("/:provider", isLoggedIn, auth.disconnect);

module.exports = router;
