const express = require("express");
const router = express.Router();
const test = require("../controllers/test");
const budgets = require("../controllers/budgets");
const transactions = require("../controllers/transactions");

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
