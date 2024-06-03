import { hello } from "@controllers/test";
import express, { Request, Response } from "express";
// import * as TestController from "../controllers/test";
// import { wrapAsync } from "../middleware/error";
import { wrapAsync } from "../middleware/error";
import { findInAppProductBySku } from "src/services/inAppProducts";

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

router.get(
  "/find-inapp-product-by-sku",
  wrapAsync(async (req: Request, res: Response) => {
    const product = await findInAppProductBySku("bear");

    return res.status(200).send({ product });
  })
);

export default router;
