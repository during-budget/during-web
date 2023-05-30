import { Budget } from "@models/Budget";
import express, { Request, Response } from "express";
import moment from "moment-timezone";
const router = express.Router();

router.get("/budgets", async (req: Request, res: Response) => {
  const budgets = await Budget.find({ startDate: { $exists: true } });
  for (let budget of budgets) {
    const year = budget.startDate.getFullYear();
    const month = budget.startDate.getMonth() + 1;
    budget.year = year;
    budget.month = month;
    await budget.save();
  }
  return res.status(200).send({ length: budgets.length });
});

export default router;
