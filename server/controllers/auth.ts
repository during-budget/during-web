import { Request, Response } from "express";
import _ from "lodash";

import { logger } from "../log/logger";
import { IUser, IUserProps, User } from "../models/User";
import { NextFunction } from "express-serve-static-core";

import passport from "passport";
import { HydratedDocument } from "mongoose";

// const redirectUrl = process.env.CLIENT?.trim() ?? "/";
const redirectUrl = process.env.CLIENT_ADMIN?.trim() ?? "/";

export const find = async (req: Request, res: Response) => {
  try {
    const user = req.user!;

    return res.status(200).send({
      snsId: user.snsId ?? {},
    });
  } catch (err: any) {
    logger.error(err.message);
    return res.status(500).send({ message: err.message });
  }
};

export const callback = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const sns = req.params.sns;
  if (sns !== "google" && sns !== "naver" && sns !== "kakao") {
    return res.redirect(
      redirectUrl + "?error=" + encodeURIComponent("invalid sns")
    );
  }

  passport.authenticate(
    sns,
    async (
      authError: Error,
      user: HydratedDocument<IUser, IUserProps>,
      type: "login" | "register" | "connect"
    ) => {
      try {
        if (authError) throw authError;

        if (type === "login") {
          return req.login(user, (loginError) => {
            if (loginError) throw loginError;
            return res.redirect(redirectUrl + "/login/redirect");
          });
        } else if (type === "register") {
          return req.login(user, (loginError) => {
            if (loginError) throw loginError;
            return res.redirect(redirectUrl + "/login/redirect?isNew=true");
          });
        } else if (type === "connect") {
        }

        return res.redirect(redirectUrl);
      } catch (err: any) {
        return res.redirect(
          redirectUrl +
            "?error=" +
            encodeURIComponent(err.message ?? "unknown error occured")
        );
      }
    }
  )(req, res, next);
};

export const disconnect = async (req: Request, res: Response) => {
  try {
    const sns = req.params.sns;
    if (sns !== "google" && sns !== "naver" && sns !== "kakao") {
      return res.status(400).send({ message: "invalid sns" });
    }

    const user = req.user!;
    if (!user.snsId || !user.snsId[sns]) {
      return res.status(404).send({ message: "not connected" });
    }

    user.snsId = { ...user.snsId, [sns]: undefined };
    if (
      !user.email &&
      !user.snsId.google &&
      !user.snsId.naver &&
      !user.snsId.kakao
    ) {
      return res
        .status(409)
        .send({ message: "At least one login method is required." });
    }
    await user.saveReqUser();

    return res.status(200).send({
      snsId: user.snsId,
    });
  } catch (err: any) {
    logger.error(err.message);
    return res.status(500).send({ message: err.message });
  }
};
