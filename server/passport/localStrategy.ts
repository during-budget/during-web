import { Request } from "express";

import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as CustomStrategy } from "passport-custom";

import { User } from "../models/User";

import { client } from "../redis";
import { decipher } from "../utils/crypto";
import { generateRandomString } from "../utils/randomString";
import {
  USER_NOT_FOUND,
  VERIFICATION_CODE_EXPIRED,
  VERIFICATION_CODE_WRONG,
} from "../@message";

const local = () => {
  passport.use(
    "local",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "code",
      },
      async function (email: string, code: string, done: any) {
        try {
          const user = await User.findOne({
            email,
            isLocal: true,
          });
          if (!user) {
            const err = new Error(USER_NOT_FOUND);
            return done(err, null, null);
          }

          const _code = await client.v4.hGet(email, "code");
          if (!_code) {
            const err = new Error(VERIFICATION_CODE_EXPIRED);
            return done(err, null, null);
          }

          if (decipher(_code) !== code) {
            const err = new Error(VERIFICATION_CODE_WRONG);
            return done(err, null, null);
          }
          await client.del(email);

          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );
};

const register = () => {
  passport.use(
    "register",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "code",
      },
      async function (email: string, code: string, done: any) {
        try {
          const _code = await client.v4.hGet(email, "code");
          if (!_code) {
            const err = new Error(VERIFICATION_CODE_EXPIRED);
            return done(err, null, null);
          }

          if (decipher(_code) !== code) {
            const err = new Error(VERIFICATION_CODE_WRONG);
            return done(err, null, null);
          }

          const user = new User({
            email,
            isLocal: true,
          });
          await user.initialize();

          await client.del(email);

          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );
};

const guest = () => {
  passport.use(
    "guest",
    new CustomStrategy(async function (req: Request, done: any) {
      try {
        const user = new User({
          userName: "guest-" + generateRandomString(5),
          isGuest: true,
        });
        user.initialize();

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    })
  );
};

export { local, register, guest };
