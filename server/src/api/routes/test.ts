import express, { Request, Response } from "express";
import { isAdmin } from "../middleware/auth";
import { wrapAsync } from "../middleware/error";

const router = express.Router();

router.get("/echo", async (req: Request, res: Response) => {
  console.log("[TEST] echo!", { message: req.query.message });

  return res.status(200).send({ message: req.query.message });
});

router.get(
  "/throw-error",
  wrapAsync(async (req: Request, res: Response) => {
    throw new Error("Intended Error");
  })
);

export default router;
