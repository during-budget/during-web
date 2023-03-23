import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { User } from "../models/User";

const local = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async function (email: string, password: string, done: any) {
        const user = await User.findOne({
          email,
        }).select("+password");
        if (!user) {
          const err = new Error("User not found");
          err.status = 404;
          return done(err, null, null);
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
          const err = new Error("Incorrect password");
          err.status = 409;
          return done(err, null, null);
        }
        return done(null, user);
      }
    )
  );
};
export { local };
