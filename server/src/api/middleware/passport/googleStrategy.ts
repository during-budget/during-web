import { Request } from "express";
import passport from "passport";
import { Strategy as GogoleStrategy, Profile } from "passport-google-oauth20";
import { User } from "src/models/User";
import {
  CONNECTED_ALREADY,
  EMAIL_IN_USE,
  SNSID_IN_USE,
  USER_NOT_FOUND,
} from "src/api/message";

const getEmail = (profile: Profile): string | undefined => {
  if (profile.emails) {
    for (let _email of profile.emails) {
      if (_email.verified) return _email.value;
    }
  }
  return undefined;
};

const getPicture = (profile: Profile): string | undefined => {
  if (profile.photos && profile.photos.length > 0) {
    return profile.photos[0].value;
  }
  return undefined;
};

type clientType = {
  ID: string;
  SECRET: string;
  callbackURL: string;
};

const google = (client: clientType) => {
  passport.use(
    "google",
    new GogoleStrategy(
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
            const user = await User.findOne({ "snsId.google": profile.id });
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
              userName: profile.displayName,
              picture: getPicture(profile),
              email,
              snsId: { google: profile.id },
            });
            await newUser.initialize();

            return done(null, newUser, "register");
          }
          /* if user is logged in - connect */
          const user = req.user!;

          if (user.snsId?.["google"]) {
            const err = new Error(CONNECTED_ALREADY);
            return done(err, null, null);
          }

          const exUser = await User.findOne({ "snsId.google": profile.id });
          if (exUser) {
            const err = new Error(SNSID_IN_USE);
            return done(err, null, null);
          }

          user.snsId = { ...user.snsId, google: profile.id };
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

const googleAdmin = (client: clientType) => {
  passport.use(
    "googleAdmin",
    new GogoleStrategy(
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
          /* login */
          const user = await User.findOne({
            auth: "admin",
            "snsId.google": profile.id,
          });
          if (user) {
            return done(null, user);
          }

          /* register(blocked) */
          const err = new Error(USER_NOT_FOUND);
          return done(err, null);
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};

export { google, googleAdmin };
