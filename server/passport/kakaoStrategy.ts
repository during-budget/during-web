import passport from "passport";
import { Strategy as KakaoStrategy } from "passport-kakao";
import { User } from "../models/User";

const kakaoConnect = () => {
  passport.use(
    "kakaoConnect",
    new KakaoStrategy(
      {
        clientID: process.env.KAKAO_CLIENT_ID?.trim() ?? "",
        callbackURL: "/api/snsId/kakao/callback",
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

export { kakaoConnect };
