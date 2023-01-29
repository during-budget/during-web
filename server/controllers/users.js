const _ = require("lodash");
const User = require("../models/User");
const passport = require("passport");

//_____________________________________________________________________________

/**
 * Register
 *
 * @body {userName: 'user00001', password: 'asdfasdf!!'}
 */
module.exports.register = async (req, res) => {
  try {
    const exUser = await User.findOne({ userName: req.body.userName });
    if (exUser)
      return res
        .status(409)
        .send({ message: `userName ${req.body.userName} is already in use` });

    // userId, password 유효성 검사
    // ...

    const user = new User({
      userName: req.body.userName,
      password: req.body.password,
    });
    await user.save();
    return res.status(200).send({});
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

/**
 * Login (local)
 *
 * @body {userName: 'user00001', password: 'asdfasdf!!'}
 */
module.exports.loginLocal = async (req, res) => {
  passport.authenticate("local", (authError, user) => {
    try {
      if (authError) throw authError;
      console.log("DEBUG: authentication is over");
      return req.login(user, (loginError) => {
        if (loginError) throw loginError;
        console.log("DEBUG: login is over");
        /* set maxAge as 1 year if auto login is requested */
        if (req.body.persist === "true") {
          req.session.cookie["maxAge"] = 365 * 24 * 60 * 60 * 1000; //1 year
        }
        console.log("DEBUG: sending response");
        return res.status(200).send({ user });
      });
    } catch (err) {
      return res.status(err.status || 500).send({ message: err.message });
    }
  })(req, res);
};

/**
 * Logout
 */
module.exports.logout = async (req, res) => {
  req.logout((err) => {
    try {
      if (err) throw err;
      req.session.destroy();
      res.clearCookie("connect.sid");
      return res.status(200).send({});
    } catch (err) {
      return res.status(err.status || 500).send({ message: err.message });
    }
  });
};

/**
 * Read current user's info
 */
module.exports.current = (req, res) => {
  return res.status(200).send({ user: req.user });
};

/**
 * Read all users (master)
 */
module.exports.list = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).send({ users });
  } catch (err) {
    return res.status(err.status || 500).send({ message: err.message });
  }
};
