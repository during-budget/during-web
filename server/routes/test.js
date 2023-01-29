const express = require("express");
const router = express.Router();
const test = require("../controllers/test");

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
