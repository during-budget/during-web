const express = require("express");
const router = express.Router();
const users = require("../controllers/users");
const { isLoggedIn, isNotLoggedIn } = require("../middleware/auth");

// Authentication
router.post("/register", isNotLoggedIn, users.register);
router.post("/login/local", isNotLoggedIn, users.loginLocal);
router.get("/logout", isLoggedIn, users.logout);
router.get("/", isLoggedIn, users.current);

module.exports = router;
