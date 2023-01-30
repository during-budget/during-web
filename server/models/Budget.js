const mongoose = require("mongoose");
const _ = require("lodash");

const categorySchema = mongoose.Schema(
  {
    categoryId: mongoose.Types.ObjectId,
    isExpense: Boolean, // true -> expense, false -> income, undefined -> etc
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

    expenseCategories: [categorySchema],

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

    incomeCategories: [categorySchema],
  },
  { timestamps: true }
);

budgetSchema.index({
  user: 1,
  startDate: -1,
});

budgetSchema.methods.findCategory = function ({ isExpense, categoryId }) {
  return _.find(isExpense ? this.expenseCategories : this.incomeCategories, {
    categoryId: mongoose.Types.ObjectId(categoryId),
  })?.toObject();
};

budgetSchema.methods.findCategoryIdx = function ({ isExpense, categoryId }) {
  return _.findIndex(
    isExpense ? this.expenseCategories : this.incomeCategories,
    {
      categoryId: mongoose.Types.ObjectId(categoryId),
    }
  );
};

module.exports = mongoose.model("Budget", budgetSchema);
