import express, { Request, Response } from "express";
import * as TestController from "../controllers/test";
import { wrapAsync } from "../middleware/error";

const router = express.Router();

router.get("/echo", async (req: Request, res: Response) => {
  return res.status(200).send({ message: req.query.message });
});

router.get("/in-app-products", wrapAsync(TestController.getInAppProducts));

export default router;
