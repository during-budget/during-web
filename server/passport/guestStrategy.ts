import { Request } from "express";
import passport from "passport";
import { Strategy as CustomStrategy } from "passport-custom";
import { User } from "../models/User";
import { generateRandomString } from "../utils/randomString";

const guest = () => {
  passport.use(
    "guest",
    new CustomStrategy(async function (req: Request, done: any) {
      let email = generateRandomString(8);
      while (true) {
        const exUser = await User.findOne({ email });
        if (exUser) email = generateRandomString(8);
        else break;
      }

      const user = new User({
        email,
        isGuest: true,
      });
      await user.save();

      return done(null, user);
    })
  );
};
export { guest };
