import express from "express";
const router = express.Router();
import * as users from "../controllers/users";
import {
  isLoggedIn,
  isNotLoggedIn,
  forceNotLoggedIn,
} from "../middleware/auth";

router.post("/register", isNotLoggedIn, users.register);
router.post("/verify", isNotLoggedIn, users.verify);
router.post("/login/guest", forceNotLoggedIn, users.loginGuest);
router.post("/login/local", forceNotLoggedIn, users.loginLocal);
router.get("/logout", isLoggedIn, users.logout);

router.get("/current", isLoggedIn, users.current);
router.get("/list", isLoggedIn, users.list);

module.exports = router;
