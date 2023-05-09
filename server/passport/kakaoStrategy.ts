import passport from "passport";
import { Strategy as KakaoStrategy, Profile } from "passport-kakao";
import { User } from "../models/User";
import { Request } from "express";

const kakao = () => {
  passport.use(
    "kakao",
    new KakaoStrategy(
      {
        clientID: process.env.KAKAO_CLIENT_ID.trim() ?? "",
        callbackURL: "/api/auth/kakao/callback",
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
            const user = await User.findOne({ "snsId.kakao": profile.id });
            if (user) {
              return done(null, user, "login");
            }

            /* register */
            const newUser = new User({
              userName: profile.displayName,
              snsId: { kakao: profile.id },
            });
            await newUser.save();
            return done(null, newUser, "register");
          }
          /* if user is logged in - connect */
          const user = req.user!;

          if (user.snsId?.["kakao"]) {
            const err = new Error("Already connected");
            return done(err, null, null);
          }

          const exUser = await User.findOne({ "snsId.kakao": profile.id });
          if (exUser) {
            const err = new Error("SnsId in use");
            return done(err, null, null);
          }

          user.snsId = { ...user.snsId, kakao: profile.id };
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

export { kakao };
