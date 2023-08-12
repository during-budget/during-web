import { Request } from "express";
import passport, { Profile } from "passport";
import { Strategy as NaverStrategy } from "passport-naver";
import { User } from "@models/User";
import { CONNECTED_ALREADY, EMAIL_IN_USE, SNSID_IN_USE } from "../@message";

const getEmail = (profile: Profile): string | undefined => {
  if (profile.emails && profile.emails.length > 0) {
    return profile.emails[0].value;
  }
  return undefined;
};

const getPicture = (profile: any): string | undefined => {
  return profile._json?.profile_image;
};

const naver = (client: { ID: string; SECRET: string; callbackURL: string }) => {
  passport.use(
    "naver",
    new NaverStrategy(
      {
        clientID: client.ID,
        clientSecret: client.SECRET,
        callbackURL: client.callbackURL,
        passReqToCallback: true,
      },
      async (
        req: Request,
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: any
      ) => {
        try {
          /* isNotLoggedIn - login or register */
          if (!req.isAuthenticated()) {
            /* login */
            const user = await User.findOne({ "snsId.naver": profile.id });
            if (user) {
              return done(null, user, "login");
            }

            /* register */
            const email = getEmail(profile);
            if (email) {
              const exUser = await User.findOne({ email });
              if (exUser) {
                const err = new Error(EMAIL_IN_USE);
                return done(err, null, null);
              }
            }

            const newUser = new User({
              email: getEmail(profile),
              picture: getPicture(profile),
              userName: profile.displayName,
              snsId: { naver: profile.id },
            });
            await newUser.initialize();
            return done(null, newUser, "register");
          }
          /* if user is logged in - connect */
          const user = req.user!;

          if (user.snsId?.["naver"]) {
            const err = new Error(CONNECTED_ALREADY);
            return done(err, null, null);
          }

          const exUser = await User.findOne({ "snsId.naver": profile.id });
          if (exUser) {
            const err = new Error(SNSID_IN_USE);
            return done(err, null, null);
          }

          user.snsId = { ...user.snsId, naver: profile.id };
          if (user.isGuest) user.isGuest = false;
          await user.saveReqUser();
          return done(null, user, "connect");
        } catch (error: any) {
          done(error);
        }
      }
    )
  );
};

export { naver };
