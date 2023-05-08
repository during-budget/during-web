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

export const google = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    "google",
    async (
      authError: Error,
      user: HydratedDocument<IUser, IUserProps>,
      type: "login" | "register" | "connect"
    ) => {
      try {
        if (authError) throw authError;

        console.log({
          user: {
            _id: user._id,
            email: user.email,
            snsId: user.snsId,
          },
          type,
        });
        if (type === "login") {
          return req.login(user, (loginError) => {
            if (loginError) throw loginError;
            return res.redirect(redirectUrl + "/login/redirect");
          });
        } else if (type === "register") {
        } else if (type === "connect") {
        }

        return res.redirect(redirectUrl);
      } catch (err: any) {
        return res.redirect(
          redirectUrl + "?error=" + encodeURIComponent("unknown error occured")
        );
      }
    }
  )(req, res, next);
};

// export const connectGoogle = async (req: Request, res: Response) => {
//   try {
//     if (!("credential" in req.body)) {
//       return res
//         .status(400)
//         .send({ message: "req.body.credential is required" });
//     }

//     const user = req.user!;
//     if (user.snsId?.google) {
//       return res.status(409).send({ mesage: "already connected" });
//     }

//     const payload = await getPayload(req.body.credential);
//     if (!payload) {
//       return res.status(409).send({ message: "payload error" });
//     }

//     const exUser1 = await User.findOne({
//       "snsId.google.id": payload.sub,
//     }).lean();
//     if (exUser1) {
//       return res.status(409).send({ message: "snsId in use" });
//     }

//     const exUser2 = await User.findOne({
//       email: payload.email,
//       _id: { $ne: user._id },
//     }).lean();
//     if (exUser2) {
//       return res.status(409).send({ message: "email in use" });
//     }

//     user.snsId = {
//       ...user.snsId,
//       google: {
//         id: payload.sub,
//         name: payload.name,
//         email: payload.email,
//         picture: payload.picture,
//       },
//     };
//     await user.saveReqUser();

//     return res.status(200).send({
//       snsId: user.snsId ?? {},
//     });
//   } catch (err: any) {
//     logger.error(err.message);
//     return res.status(500).send({ message: err.message });
//   }
// };

export const disconnectGoogle = async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    if (!user.snsId?.google) {
      return res.status(409).send({ message: "not connected" });
    }

    user.snsId = { ...user.snsId, google: undefined };
    await user.saveReqUser();

    return res.status(200).send({
      snsId: user.snsId ?? {},
    });
  } catch (err: any) {
    logger.error(err.message);
    return res.status(500).send({ message: err.message });
  }
};

export const naver = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    "naver",
    async (
      authError: Error,
      user: HydratedDocument<IUser, IUserProps>,
      type: "login" | "register" | "connect"
    ) => {
      try {
        if (authError) throw authError;

        console.log({
          user: {
            _id: user._id,
            email: user.email,
            snsId: user.snsId,
          },
          type,
        });
        if (type === "login") {
          return req.login(user, (loginError) => {
            if (loginError) throw loginError;
            return res.redirect(redirectUrl + "/login/redirect");
          });
        } else if (type === "register") {
        } else if (type === "connect") {
        }

        return res.redirect(redirectUrl);
      } catch (err: any) {
        return res.redirect(
          redirectUrl + "?error=" + encodeURIComponent("unknown error occured")
        );
      }
    }
  )(req, res, next);
};

export const disconnectNaver = async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    if (!user.snsId?.naver) {
      return res.status(409).send({ message: "not connected" });
    }

    user.snsId = { ...user.snsId, naver: undefined };
    await user.saveReqUser();

    return res.status(200).send({
      snsId: user.snsId ?? {},
    });
  } catch (err: any) {
    logger.error(err.message);
    return res.status(500).send({ message: err.message });
  }
};

export const kakao = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    "kakao",
    async (
      authError: Error,
      user: HydratedDocument<IUser, IUserProps>,
      type: "login" | "register" | "connect"
    ) => {
      try {
        if (authError) throw authError;

        console.log({
          user: {
            _id: user._id,
            email: user.email,
            snsId: user.snsId,
          },
          type,
        });
        if (type === "login") {
          return req.login(user, (loginError) => {
            if (loginError) throw loginError;
            return res.redirect(redirectUrl + "/login/redirect");
          });
        } else if (type === "register") {
        } else if (type === "connect") {
        }

        return res.redirect(redirectUrl);
      } catch (err: any) {
        return res.redirect(
          redirectUrl + "?error=" + encodeURIComponent("unknown error occured")
        );
      }
    }
  )(req, res, next);
};

export const disconnectKakao = async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    if (!user.snsId?.kakao) {
      return res.status(409).send({ message: "not connected" });
    }

    user.snsId = { ...user.snsId, kakao: undefined };
    await user.saveReqUser();

    return res.status(200).send({
      snsId: user.snsId ?? {},
    });
  } catch (err: any) {
    logger.error(err.message);
    return res.status(500).send({ message: err.message });
  }
};
