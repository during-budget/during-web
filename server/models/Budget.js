const mongoose = require("mongoose");
const _ = require("lodash");

const categorySchema = mongoose.Schema(
  {
    categoryId: mongoose.Types.ObjectId,
    isExpense: { type: Boolean, default: false },
    isIncome: { type: Boolean, default: false },
    isDefault: { type: Boolean, default: false },
    title: String,
    icon: String,
    amountScheduled: {
      type: Number,
      default: 0,
    },
    amountCurrent: {
      type: Number,
      default: 0,
    },
    amountPlanned: {
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

    //예정 지출
    expenseScheduled: {
      type: Number,
      default: 0,
    },

    //현재 지출
    expenseCurrent: {
      type: Number,
      default: 0,
    },

    //지출 예산 총액
    expensePlanned: {
      type: Number,
      default: 0,
    },

    //예정 수입
    incomeScheduled: {
      type: Number,
      default: 0,
    },

    //현재 수입
    incomeCurrent: {
      type: Number,
      default: 0,
    },

    //수입 예산 총액

    incomePlanned: {
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

budgetSchema.methods.findCategory = function (categoryId) {
  return _.find(this.categories, {
    categoryId: mongoose.Types.ObjectId(categoryId),
  })?.toObject();
};

budgetSchema.methods.findCategoryIdx = function (categoryId) {
  return _.findIndex(this.categories, {
    categoryId: mongoose.Types.ObjectId(categoryId),
  });
};

module.exports = mongoose.model("Budget", budgetSchema);
