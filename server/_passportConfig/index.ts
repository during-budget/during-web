import { HydratedDocument, Types, Model } from "mongoose";
import passport from "passport";
import { google, googleAdmin } from "./googleStrategy";
import { naver } from "./naverStrategy";
import { kakao } from "./kakaoStrategy";
import { localV2 } from "./localV2Strategy";
import { guestV2 } from "./guestV2Strategy";
import { User, IUser, IUserProps } from "@models/User";

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

  google();
  googleAdmin();

  naver();
  kakao();

  localV2();
  guestV2();
};

export { config };
