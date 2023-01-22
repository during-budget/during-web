const mongoose = require("mongoose");

const testSchema = mongoose.Schema(
  {
    data: Object,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Test", testSchema);
