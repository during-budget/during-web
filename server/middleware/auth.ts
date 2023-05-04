import { Request, Response, NextFunction } from "express";

export const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(403).send({ message: "You are not logged in." });
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
    res.status(403).send({ message: "You are already logged in." });
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
      console.log("forced to logout");
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
      res.status(403).send({ message: "You have no permission." });
    }
  } else {
    res.status(403).send({ message: "You are not logged in." });
  }
};
