import { HydratedDocument, Types, Model } from "mongoose";
import passport from "passport";
import { local } from "./localStrategy";
import { User, IUser, IUserModel } from "../models/User";

type TUser = {
  _id?: Types.ObjectId;
  isGuest?: boolean;
};

const config = () => {
  passport.serializeUser((user, done) => {
    done(null, { _id: user._id, isGuest: user?.isGuest });
  });

  passport.deserializeUser(({ _id }, done) => {
    User.findById(
      _id,
      (err: any, user: HydratedDocument<IUser, IUserModel>) => {
        if (err) done(err);
        done(null, user);
      }
    );
  });

  local();
};

export { config };
