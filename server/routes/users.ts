import express from "express";
const router = express.Router();
import * as users from "../controllers/users";
import {
  isLoggedIn,
  isNotLoggedIn,
  forceNotLoggedIn,
  isAdmin,
} from "../middleware/auth";

import passport from "passport";

/* regiser */
router.post("/register", isNotLoggedIn, users.register);
router.post("/register/verify", isNotLoggedIn, users.verify);

/* login guest */
router.post("/login/guest", forceNotLoggedIn, users.loginGuest);

/* login local */
router.post("/login/local", forceNotLoggedIn, users.loginLocal);
router.post("/login/local/verify", forceNotLoggedIn, users.loginVerify);

/* social login */
// router.post("/login/google", forceNotLoggedIn, users.loginGoogle);

router.get(
  "/login/naver",
  passport.authenticate("naver", { authType: "reprompt" })
);
router.get("/login/naver/callback", users.loginNaver);

/* logout */
router.get("/logout", isLoggedIn, users.logout);

router.put("/", isLoggedIn, users.updateFields);

router.get("/current", isLoggedIn, users.current);

/* delete account */
router.delete("/", isLoggedIn, users.remove);

/* admin */
router.get("/", isAdmin, users.list);
router.get("/:_id", isAdmin, users.find);
router.delete("/:_id", isAdmin, users.remove2);

module.exports = router;
