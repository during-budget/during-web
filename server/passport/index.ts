import { HydratedDocument, Types, Model } from "mongoose";
import passport from "passport";
import { local, register, guest } from "./localStrategy";
import { google } from "./googleStrategy";
import { naver } from "./naverStrategy";
import { kakao } from "./kakaoStrategy";
import { User, IUser, IUserProps } from "../models/User";

const config = () => {
  passport.serializeUser((user, done) => {
    done(null, { _id: user._id, isGuest: user?.isGuest });
  });

  passport.deserializeUser(({ _id }, done) => {
    User.findById(
      _id,
      (err: any, user: HydratedDocument<IUser, IUserProps>) => {
        if (err) done(err);
        done(null, user);
      }
    );
  });

  local();
  register();
  guest();

  google();
  naver();
  kakao();
};

export { config };
