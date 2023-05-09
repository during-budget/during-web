import express from "express";
const router = express.Router();
import { isLoggedIn } from "../middleware/auth";
import * as auth from "../controllers/auth";
import passport from "passport";

router.get("/", isLoggedIn, auth.find);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile"],
  })
);
router.get("/naver", passport.authenticate("naver"));
router.get("/kakao", passport.authenticate("kakao"));

router.get("/:sns/callback", auth.callback);

router.delete("/:sns", isLoggedIn, auth.disconnect);

module.exports = router;
