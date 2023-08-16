import { Request } from "express";
import passport from "passport";
import { Strategy as CustomStrategy } from "passport-custom";
import * as UserService from "src/services/user";

const guestV2 = () => {
  passport.use(
    "guestV2",
    new CustomStrategy(async function (req: Request, done: any) {
      try {
        const { user } = await UserService.createGuest();

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    })
  );
};

export { guestV2 };
