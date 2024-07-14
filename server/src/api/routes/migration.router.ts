import express, { Request, Response } from "express";
import { isAdmin } from "../middleware/auth";
import { wrapAsync } from "../middleware/error";
import { PaymentService } from "src/services/payment.service";

const router = express.Router();

/** migration 1 */
router.post(
  "/set-isDestroyed",
  isAdmin,
  wrapAsync(async (req: Request, res: Response) => {
    const { count } = await PaymentService.setIsDestroyed();

    return res.status(200).send({ count });
  })
);

/** migration 2 */
router.post(
  "/destroy-unpaid-payments",
  isAdmin,
  wrapAsync(async (req: Request, res: Response) => {
    const { count } = await PaymentService.destroyUnpaidPayments();

    return res.status(200).send({ count });
  })
);

/** migration 3 */
router.post(
  "/set-platform",
  isAdmin,
  wrapAsync(async (req: Request, res: Response) => {
    const result = await PaymentService.setPlatform();

    return res.status(200).send(result);
  })
);

export default router;
