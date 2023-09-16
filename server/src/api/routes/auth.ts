import express from "express";
const router = express.Router();
import { isLoggedIn, isNotLoggedIn } from "src/api/middleware/auth";
import * as auth from "src/api/controllers/auth";
import passport from "passport";
import { wrapAsync } from "../middleware/error";

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

router.post("/local", auth.local);
router.post("/guest", auth.guest);

router.get("/:provider/callback", auth.callback);

router.delete("/:provider", isLoggedIn, wrapAsync(auth.disconnect));

router.get("/logout", isLoggedIn, auth.logout);

export default router;
