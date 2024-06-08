import {
  migrateChartSkinCatToBasic as migrateCatChartSkins,
  migrateItemPrices,
} from "@controllers/test";
import express, { Request, Response } from "express";
import { isAdmin } from "../middleware/auth";
import { wrapAsync } from "../middleware/error";
// import * as TestController from "../controllers/test";
// import { wrapAsync } from "../middleware/error";

const router = express.Router();

router.get("/echo", async (req: Request, res: Response) => {
  console.log("[TEST] echo!", { message: req.query.message });

  return res.status(200).send({ message: req.query.message });
});

router.post("/migrate-item-prices", isAdmin, wrapAsync(migrateItemPrices));

router.post(
  "/migrate-cat-chartSkins",
  isAdmin,
  wrapAsync(migrateCatChartSkins)
);

export default router;
