import express from "express";
const router = express.Router();
import * as users from "../controllers/users";
import {
  isLoggedIn,
  isNotLoggedIn,
  forceNotLoggedIn,
} from "../middleware/auth";

/* regiser */
router.post("/register", isNotLoggedIn, users.register);
router.post("/register/verify", isNotLoggedIn, users.verify);

/* login guest */
router.post("/login/guest", forceNotLoggedIn, users.loginGuest);

/* login local */
router.post("/login/local", forceNotLoggedIn, users.loginLocal);
router.post("/login/local/verify", forceNotLoggedIn, users.loginVerify);

/* logout */
router.get("/logout", isLoggedIn, users.logout);

router.put("/", isLoggedIn, users.updateFields);

router.get("/current", isLoggedIn, users.current);
router.get("/list", isLoggedIn, users.list);

module.exports = router;
