const User = require("../models/User");

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(403).send({ message: "You are not logged in." });
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    res.status(403).send({ message: "You are already logged in." });
  }
};

exports.forceNotLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    req.logout((err) => {
      if (err) return res.status(500).send({ err: err.message });
      console.log("forced to logout");
      next();
    });
  } else {
    next();
  }
};
