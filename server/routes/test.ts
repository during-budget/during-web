import express, { Request, Response } from "express";
const router = express.Router();
import * as test from "../controllers/test";
import * as budgets from "../controllers/budgets";
import * as transactions from "../controllers/transactions";

router.get("/", async (req: Request, res: Response) => {
  return res.status(200).send({ message: "hello world!" });
});

/**
 */
router.get("/:model", test.findDocuments);
router.get("/:model/:_id", test.findDocument);

router.delete("/users/:_id", test.removeUser);
router.delete("/budgets/:_id", budgets.remove);
router.delete("/transactions/:_id", transactions.remove);

router.get("/", test.hello);
router.get("/dataList", test.dataList);
/**
 * CRUD testData
 */
router.post("/", test.create);
router.get("/:_id", test.find);
router.put("/:_id", test.update);
router.delete("/:_id", test.remove);

module.exports = router;
