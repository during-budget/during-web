import { Types } from "mongoose";
import { Budget as BudgetModel } from "src/models/Budget";

export const createBasicBudget = async (user: {
  _id: Types.ObjectId;
  categories: any[];
}) => {
  const budgetRecord = await BudgetModel.create({
    userId: user._id,
    title: "기본 예산",
    categories: user.categories.map((category) => {
      return {
        ...category,
        categoryId: category._id,
        amountPlanned: 0,
      };
    }),
  });
  return { budget: budgetRecord };
};
