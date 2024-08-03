import { Request, Response, NextFunction } from "express";
import {
  ALREADY_LOGGED_IN,
  NOT_LOGGED_IN,
  NOT_PERMITTED,
} from "src/api/message";
import { API_KEY_COOKIE, API_KEYS } from "src/loaders/express";

export const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(400).send({ message: NOT_LOGGED_IN });
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
    res.status(400).send({ message: ALREADY_LOGGED_IN });
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
      res.status(400).send({ message: NOT_PERMITTED });
    }
  } else {
    res.status(400).send({ message: NOT_LOGGED_IN });
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
    res.status(400).send({ message: NOT_LOGGED_IN });
  }
};

export function validateAPIKey(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.url === "/api/develop/generate-api-key") {
    return next();
  }

  if (!(API_KEY_COOKIE in req.cookies)) {
    return res.status(400).send({
      code: "API_KEY_REQUIRED",
      message: "API key is required",
    });
  }

  if (!API_KEYS.has(req.cookies[API_KEY_COOKIE])) {
    return res.status(400).send({
      code: "API_KEY_INVALID",
      message: "API key is invalid or expired",
    });
  }

  return next();
}
