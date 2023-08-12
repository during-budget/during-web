import { Request } from "express";
import passport from "passport";
import { Strategy as CustomStrategy } from "passport-custom";

import { User } from "src/models/User";

import { generateRandomString } from "utils/randomString";

const guestV2 = () => {
  passport.use(
    "guestV2",
    new CustomStrategy(async function (req: Request, done: any) {
      try {
        const user = new User({
          userName: "guest-" + generateRandomString(5),
          isGuest: true,
        });
        user.initialize();

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    })
  );
};

export { guestV2 };
