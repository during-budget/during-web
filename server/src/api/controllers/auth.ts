import { Request, Response } from "express";
import _ from "lodash";

import { logger } from "src/loggers";
import { IUser, IUserProps, User } from "@models/User";
import { NextFunction } from "express-serve-static-core";

import passport from "passport";
import { HydratedDocument } from "mongoose";

import {
  CONNECT_SUCCESS,
  LOGIN_SUCCESS,
  REGISTER_SUCCESS,
  FIELD_INVALID,
  AT_LEAST_ONE_SNSID_IS_REQUIRED,
  NOT_FOUND,
  EMAIL_UPDATE_SUCCESS,
  LOGIN_VERIFICATION_CODE_SENT,
  REGISTER_VERIFICATION_CODE_SENT,
  EMAIL_UPDATE_VERIFICATION_CODE_SENT,
} from "../message";
import { Budget } from "@models/Budget";
import { Transaction } from "@models/Transaction";

const clientRedirectURL = process.env.CLIENT.trim() + "/redirect/auth";

const clientAdminURL = process.env.CLIENT_ADMIN.trim();

export const find = async (req: Request, res: Response) => {
  try {
    const user = req.user!;

    return res.status(200).send({
      email: user.email,
      isLocal: user.isLocal,
      snsId: user.snsId ?? {},
      isGuest: user.isGuest,
    });
  } catch (err: any) {
    logger.error(err.message);
    return res.status(500).send({ message: err.message });
  }
};

export const callbackAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    "googleAdmin",
    async (authError: Error, user: HydratedDocument<IUser, IUserProps>) => {
      try {
        if (authError) throw authError;
        return req.login(user, (loginError) => {
          if (loginError) throw loginError;
          return res.redirect(clientAdminURL + "/login/redirect");
        });
      } catch (err: any) {
        logger.error(err.message);
        return res.redirect(
          clientAdminURL + "?error=" + encodeURIComponent(err.message)
        );
      }
    }
  )(req, res, next);
};

export const callback = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const provider = req.params.provider;
  if (provider !== "google" && provider !== "naver" && provider !== "kakao") {
    return res.redirect(
      clientRedirectURL +
        "?message=" +
        encodeURIComponent(FIELD_INVALID("provider"))
    );
  }

  passport.authenticate(
    provider,
    async (
      authError: Error,
      user: HydratedDocument<IUser, IUserProps>,
      type: "login" | "register" | "connect"
    ) => {
      try {
        if (authError) {
          return res.redirect(
            clientRedirectURL +
              `?message=${encodeURIComponent(authError.message)}`
          );
        }

        /* _____ 소셜 로그인 _____ */
        if (type === "login") {
          return req.login(user, (loginError) => {
            if (loginError) {
              throw loginError;
            }
            // 로그인 성공
            req.session.cookie["maxAge"] = 365 * 24 * 60 * 60 * 1000; //1 year
            return res.redirect(
              clientRedirectURL +
                `?message=${encodeURIComponent(LOGIN_SUCCESS)}`
            );
          });
        } else if (type === "register") {
          /* _____ 소셜 회원 가입 _____ */
          return req.login(user, (loginError) => {
            if (loginError) {
              throw loginError;
            }
            // 회원 가입 후 로그인 성공
            req.session.cookie["maxAge"] = 365 * 24 * 60 * 60 * 1000; //1 year
            return res.redirect(
              clientRedirectURL + `?message=${REGISTER_SUCCESS}`
            );
          });
        }
        /* _____ 소셜 계정 연결 _____ */
        // 소셜 계정 연결 성공
        return res.redirect(
          clientRedirectURL + `?message=${encodeURIComponent(CONNECT_SUCCESS)}`
        );
      } catch (err: any) {
        logger.error(err.message);
        return res.redirect(
          clientRedirectURL + `?message=${encodeURIComponent(err.message)}`
        );
      }
    }
  )(req, res, next);
};

export const local = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    "localV2",
    async (
      authError?: Error,
      user?: HydratedDocument<IUser, IUserProps>,
      type?:
        | "login"
        | "loginVerify"
        | "register"
        | "registerVerify"
        | "updateEmail"
        | "updateEmailVerify"
    ) => {
      try {
        if (authError) {
          return res.status(401).send({ message: authError.message });
        }

        /* _____ 로그인 & 회원가입 & 이메일 변경 _____ */
        if (type === "login") {
          return res
            .status(200)
            .send({ message: LOGIN_VERIFICATION_CODE_SENT });
        }
        if (type === "register") {
          return res
            .status(200)
            .send({ message: REGISTER_VERIFICATION_CODE_SENT });
        }
        if (type === "updateEmail") {
          return res
            .status(200)
            .send({ message: EMAIL_UPDATE_VERIFICATION_CODE_SENT });
        }
        /* _____ 로그인 & 회원가입 검증 _____ */
        if ((type === "loginVerify" || type === "registerVerify") && user) {
          return req.login(user, (loginError) => {
            if (loginError) throw loginError;
            /* set maxAge as 1 year if auto login is requested */
            if (req.body.persist === true) {
              req.session.cookie["maxAge"] = 365 * 24 * 60 * 60 * 1000; //1 year
            }
            return res.status(200).send({
              message:
                type === "loginVerify" ? LOGIN_SUCCESS : REGISTER_SUCCESS,
              user,
            });
          });
        }
        /* _____ 이메일 변경 검증 _____ */
        if (type === "updateEmailVerify" && user) {
          return res.status(200).send({
            message: EMAIL_UPDATE_SUCCESS,
            user: {
              _id: user._id,
              email: user.email,
              isLocal: user.isLocal,
              isGuest: user.isGuest,
            },
          });
        }
      } catch (err: any) {
        logger.error(err.message);
        return res.status(500).send({ message: err.message });
      }
    }
  )(req, res, next);
};

export const guest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    "guestV2",
    async (authError?: Error, user?: HydratedDocument<IUser, IUserProps>) => {
      try {
        if (authError || !user) {
          throw authError;
        }
        return req.login(user, (loginError) => {
          if (loginError) throw loginError;
          /* set maxAge as 1 year if auto login is requested */
          if (req.body.persist === true) {
            req.session.cookie["maxAge"] = 365 * 24 * 60 * 60 * 1000; //1 year
          }
          return res.status(200).send({
            message: LOGIN_SUCCESS,
            user,
          });
        });
      } catch (err: any) {
        logger.error(err.message);
        return res.status(500).send({ message: err.message });
      }
    }
  )(req, res, next);
};

export const disconnect = async (req: Request, res: Response) => {
  try {
    const provider = req.params.provider;
    const user = req.user!;

    if (provider === "google" || provider === "naver" || provider === "kakao") {
      if (!user.snsId || !user.snsId[provider]) {
        return res.status(404).send({ message: NOT_FOUND("snsId") });
      }
      user.snsId = { ...user.snsId, [provider]: undefined };
    } else if (provider === "local") {
      user.isLocal = false;
    } else {
      return res.status(400).send({ message: FIELD_INVALID(provider) });
    }

    if (
      !user.isLocal &&
      !user.snsId.google &&
      !user.snsId.naver &&
      !user.snsId.kakao
    ) {
      return res.status(409).send({ message: AT_LEAST_ONE_SNSID_IS_REQUIRED });
    }
    await user.saveReqUser();

    return res.status(200).send({
      email: user.email,
      isLocal: user.isLocal,
      snsId: user.snsId ?? {},
      isGuest: user.isGuest,
    });
  } catch (err: any) {
    logger.error(err.message);
    return res.status(500).send({ message: err.message });
  }
};

export const logout = async (req: Request, res: Response) => {
  const userId = req.user!._id;
  const isGuest = req.user!.isGuest;

  req.logout(async (err: Error) => {
    try {
      if (err) throw err;
      req.session.destroy(() => {});
      res.clearCookie("connect.sid");
      if (isGuest) {
        await Promise.all([
          User.findByIdAndDelete(userId),
          Budget.deleteMany({ userId }),
          Transaction.deleteMany({ userId }),
        ]);
      }
      return res.status(200).send({});
    } catch (err: any) {
      logger.error(err.message);
      return res.status(err.status || 500).send({ message: err.message });
    }
  });
};
