const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware/auth");

const categories = require("../controllers/categories");

router.get("/", isLoggedIn, categories.find);

router.post("/", isLoggedIn, categories.create);
router.put("/swap", isLoggedIn, categories.swap);
router.put("/:_id", isLoggedIn, categories.update);

router.delete("/:_id", isLoggedIn, categories.remove);

module.exports = router;
