import passport from "passport";
import { Strategy as NaverStrategy } from "passport-naver-v2";
import { User } from "../models/User";

const naver = () => {
  passport.use(
    new NaverStrategy(
      {
        clientID: process.env.NAVER_CLIENT_ID?.trim() ?? "",
        clientSecret: process.env.NAVER_CLIENT_SECRET?.trim() ?? "",
        callbackURL: "/api/users/login/naver/callback",
      },
      async (
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: any
      ) => {
        try {
          const exUser = await User.findOne({
            "snsId.naver": profile.id,
          });

          // if acount exists
          if (exUser) {
            done(null, exUser);
          }
          // if acount doesn't exist
          else {
            const err = new Error("User not found");
            err.status = 404;
            return done(err, null, null);
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};

const naverConnect = () => {
  passport.use(
    "naverConnect",
    new NaverStrategy(
      {
        clientID: process.env.NAVER_CLIENT_ID?.trim() ?? "",
        clientSecret: process.env.NAVER_CLIENT_SECRET?.trim() ?? "",
        callbackURL: "/api/snsId/naver/callback",
      },
      async (
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: any
      ) => {
        try {
          return done(null, profile);
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};

export { naver, naverConnect };
