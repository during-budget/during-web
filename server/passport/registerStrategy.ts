import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { User } from "../models/User";
import { client } from "../redis";
import { decipher } from "../utils/crypto";

const register = () => {
  passport.use(
    "register",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "code",
      },
      async function (email: string, code: string, done: any) {
        const _code = await client.v4.hGet(email, "code");
        if (!_code) {
          const err = new Error("Verification code is expired");
          err.status = 404;
          return done(err, null, null);
        }

        if (decipher(_code) !== code) {
          const err = new Error("Verification code is wrong");
          err.status = 409;
          return done(err, null, null);
        }

        const user = new User({
          email,
        });
        await user.save();
        await client.del(email);

        return done(null, user);
      }
    )
  );
};
export { register };
