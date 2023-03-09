const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware/auth");

const categories = require("../controllers/categories");

router.put("/", isLoggedIn, categories.updateV2);

router.get("/", isLoggedIn, categories.find);

router.post("/", isLoggedIn, categories.create); //deprecated
router.put("/swap", isLoggedIn, categories.swap); //deprecated
router.put("/:_id", isLoggedIn, categories.update); //deprecated
router.delete("/:_id", isLoggedIn, categories.remove); //deprecated

module.exports = router;
