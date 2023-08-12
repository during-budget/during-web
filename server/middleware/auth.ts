import { Request, Response, NextFunction } from "express";
import {
  ALREADY_LOGGED_IN,
  NOT_LOGGED_IN,
  NOT_PERMITTED,
} from "src/api/message";

export const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(403).send({ message: NOT_LOGGED_IN });
  }
};

export const isNotLoggedIn = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    res.status(403).send({ message: ALREADY_LOGGED_IN });
  }
};

export const forceNotLoggedIn = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.isAuthenticated()) {
    req.logout((err) => {
      if (err) return res.status(500).send({ err: err.message });
      next();
    });
  } else {
    next();
  }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    if (req.user.auth === "admin") {
      next();
    } else {
      res.status(403).send({ message: NOT_PERMITTED });
    }
  } else {
    res.status(403).send({ message: NOT_LOGGED_IN });
  }
};

export const isPortOneWebHook = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const ip =
    req.headers["x-forwarded-for"] || req.socket.remoteAddress || undefined;
  if (ip === "52.78.100.19" || ip === "52.78.48.223" || ip === "52.78.5.241") {
    next();
  } else {
    res.status(403).send({ message: NOT_LOGGED_IN });
  }
};
