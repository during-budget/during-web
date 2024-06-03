import { hello } from "@controllers/test";
import express, { Request, Response } from "express";
// import * as TestController from "../controllers/test";
// import { wrapAsync } from "../middleware/error";

const router = express.Router();

router.get("/echo", async (req: Request, res: Response) => {
  console.log("[TEST] echo!", { message: req.query.message });

  return res.status(200).send({ message: req.query.message });
});

export default router;
