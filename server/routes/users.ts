import express from "express";
const router = express.Router();
import * as users from "../controllers/users";
import {
  isLoggedIn,
  isNotLoggedIn,
  forceNotLoggedIn,
  isAdmin,
} from "../middleware/auth";

/* regiser */ //deprecated
router.post("/register", isNotLoggedIn, users.register);
router.post("/register/verify", isNotLoggedIn, users.verify);

/* login guest */ //deprecated
router.post("/login/guest", forceNotLoggedIn, users.loginGuest);

/* login local */ //deprecated
router.post("/login/local", forceNotLoggedIn, users.loginLocal);
router.post("/login/local/verify", forceNotLoggedIn, users.loginVerify);

/* logout */ //deprecated
router.get("/logout", isLoggedIn, users.logout);

router.put("/", isLoggedIn, users.updateFields);

router.get("/current", isLoggedIn, users.current);

/* delete account */
router.delete("/", isLoggedIn, users.remove);

/* admin */
router.get("/", isAdmin, users.list);
router.get("/:_id", isAdmin, users.find);
router.delete("/:_id", isAdmin, users.remove2);

export default router;
