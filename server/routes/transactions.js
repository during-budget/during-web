const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware/auth");
const transactions = require("../controllers/transactions");

router.post("/", isLoggedIn, transactions.create);

router.put("/:_id/category", isLoggedIn, transactions.updateCategory);
router.patch("/:_id", isLoggedIn, transactions.updateField);

router.get("/:_id?", isLoggedIn, transactions.find);

router.delete("/:_id", isLoggedIn, transactions.remove);

module.exports = router;
