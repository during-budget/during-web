const express = require("express");
const router = express.Router();
const users = require("../controllers/users");

// Authentication
router.post("/register", users.register);
router.post("/login/local", users.loginLocal);
router.get("/logout", users.logout);
router.get("/", users.current);

module.exports = router;
