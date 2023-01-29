const express = require("express");
const router = express.Router();
const users = require("../controllers/users");
const {
  isLoggedIn,
  isNotLoggedIn,
  forceNotLoggedIn,
} = require("../middleware/auth");

// Authentication
router.post("/register", isNotLoggedIn, users.register);
router.post("/login/local", forceNotLoggedIn, users.loginLocal);
router.get("/logout", isLoggedIn, users.logout);
router.get("/", isLoggedIn, users.current);

router.get("/list", isLoggedIn, users.list);

module.exports = router;
