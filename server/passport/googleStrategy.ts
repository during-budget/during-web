import { Request } from "express";
import passport from "passport";
import { Strategy as GogoleStrategy, Profile } from "passport-google-oauth20";
import { User } from "../models/User";

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

const google = () => {
  passport.use(
    "google",
    new GogoleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID.trim() ?? "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET.trim() ?? "",
        callbackURL: "/api/auth/google/callback",
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
                const err = new Error("email in use");
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
            const err = new Error("Already connected");
            return done(err, null, null);
          }

          const exUser = await User.findOne({ "snsId.google": profile.id });
          if (exUser) {
            const err = new Error("SnsId in use");
            return done(err, null, null);
          }

          user.snsId = { ...user.snsId, google: profile.id };
          if (user.isGuest) user.isGuest = false;
          await user.saveReqUser();
          return done(null, user, "connect");
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};

const googleAdmin = () => {
  passport.use(
    "googleAdmin",
    new GogoleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID.trim() ?? "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET.trim() ?? "",
        callbackURL: "/api/auth/google/admin/callback",
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
          const err = new Error("user not found");
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
