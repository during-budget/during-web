import { Request, Response, NextFunction } from "express";
import { ALREADY_LOGGED_IN, NOT_LOGGED_IN, NOT_PERMITTED } from "../@message";

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
