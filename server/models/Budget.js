const mongoose = require("mongoose");

const categorySchema = mongoose.Schema(
  {
    categoryId: mongoose.Types.ObjectId,
    isExpense: { type: Boolean, default: true },
    title: String,
    icon: String,
    ammount: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

const budgetSchema = mongoose.Schema(
  {
    userId: mongoose.Types.ObjectId,
    startDate: Date,
    endDate: Date,
    title: String,

    ammountScheduled: {
      //예정 지출
      type: Number,
      default: 0,
    },

    ammountCurrent: {
      //현재 지출
      type: Number,
      default: 0,
    },

    ammountBudget: {
      //예산 총액
      type: Number,
      default: 0,
    },
    categories: [categorySchema],
  },
  { timestamps: true }
);

budgetSchema.index({
  user: 1,
  startDate: -1,
});

module.exports = mongoose.model("Budget", budgetSchema);
