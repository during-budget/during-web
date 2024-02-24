import { HydratedDocument, Types } from "mongoose";

import { Budget as BudgetModel, IBudget, ICategory } from "src/models/Budget";
import { UserEntity } from "src/models/User";

import * as TransactionService from "src/services/transactions";
import { CategoryService as UserCategoryService } from "src/services/users";

export const isDefaultCategory = (category: ICategory) => category.isDefault;

const findDefaultExpenseCategory = (budgetRecord: IBudget) => {
  return {
    category: budgetRecord.categories[budgetRecord.categories.length - 2],
  };
};

const findDefaultIncomeCategory = (budgetRecord: IBudget) => {
  return {
    category: budgetRecord.categories[budgetRecord.categories.length - 1],
  };
};

export const findById = (
  budgetRecord: HydratedDocument<IBudget>,
  _categoryId: string | Types.ObjectId
) => {
  const categoryId = new Types.ObjectId(_categoryId);
  for (let i = 0; i < budgetRecord.categories.length; i++) {
    if (budgetRecord.categories[i].categoryId.equals(categoryId)) {
      return { idx: i, category: budgetRecord.categories[i] };
    }
  }
  return { idx: -1, category: undefined };
};

export const update = async (
  userRecord: UserEntity,
  categoryId: Types.ObjectId,
  newCategory: { _id?: Types.ObjectId; categoryId?: Types.ObjectId }
) => {
  newCategory.categoryId = newCategory.categoryId ?? newCategory._id;

  const budgetRecordList = await BudgetModel.find({
    userId: userRecord._id,
    "categories.categoryId": categoryId,
  });

  await Promise.all(
    budgetRecordList.map((budgetRecord) => {
      const { idx } = findById(budgetRecord, categoryId);
      Object.assign(budgetRecord.categories[idx], newCategory);
      budgetRecord.markModified("categories");
      budgetRecord.save();
    })
  );
};

export const updateAll = async (
  userRecord: UserEntity,
  budgetRecord: HydratedDocument<IBudget>,
  isExpense: boolean,
  categories: any[]
) => {
  const categoryDict: { [key: string]: ICategory } = Object.fromEntries(
    budgetRecord.categories.map((category) => [category.categoryId, category])
  );

  const _categories: Types.DocumentArray<ICategory> = new Types.DocumentArray(
    []
  );
  const included: Types.DocumentArray<ICategory> = new Types.DocumentArray([]);
  const updated: Types.DocumentArray<ICategory> = new Types.DocumentArray([]);
  const excluded: Types.DocumentArray<ICategory> = new Types.DocumentArray([]);

  for (let _category of categories) {
    if (!("categoryId" in _category)) continue;

    /* include category */
    if (!categoryDict[_category.categoryId]) {
      const { category } = UserCategoryService.findById(
        userRecord,
        _category.categoryId
      );
      if (!category) continue;

      if (category.isDefault) continue;
      if (category.isExpense !== isExpense) continue;

      const newCategory = {
        ...category,
        categoryId: category._id,
        amountPlanned: _category.amountPlanned,
      };
      _categories.push(newCategory);
      included.push(newCategory);
    } /* update category */ else {
      const key = _category.categoryId;
      const exCategory = categoryDict[key];
      if (!exCategory) continue;
      if (exCategory.isDefault) continue;
      if (exCategory.isExpense !== isExpense) continue;

      const category = {
        ...exCategory,
        amountPlanned: _category.amountPlanned,
        autoPlanned: _category.autoPlanned,
      };
      _categories.push(category);
      delete categoryDict[key];

      if (category.amountPlanned !== exCategory.amountPlanned) {
        updated.push(category);
      }
    }
  }
  /* exclude category */
  for (const category of Object.values(categoryDict)) {
    if (!category.isDefault) {
      if (category.isExpense === isExpense) {
        excluded.push(category);
      } else {
        _categories.push(category);
      }
    }
  }

  const { category: defaultExpenseCategory } =
    findDefaultExpenseCategory(budgetRecord);
  const { category: defaultIncomeCategory } =
    findDefaultIncomeCategory(budgetRecord);
  _categories.push(defaultExpenseCategory);
  _categories.push(defaultIncomeCategory);
  budgetRecord.categories = _categories;

  for (const category of excluded) {
    if (isExpense) {
      await TransactionService.replaceTransactionsCategory(
        budgetRecord._id,
        category,
        defaultExpenseCategory
      );
    } else {
      await TransactionService.replaceTransactionsCategory(
        budgetRecord._id,
        category,
        defaultIncomeCategory
      );
    }
  }

  await budgetRecord.save();

  return { excluded, included, updated };
};

export const updateAmountPlanned = async (
  budgetRecord: HydratedDocument<IBudget>,
  category: ICategory,
  amountPlanned: number
) => {
  category.amountPlanned = amountPlanned;
  category.autoPlanned = false;
  await budgetRecord.save();
};

export const remove = async (
  userRecord: UserEntity,
  categoryId: Types.ObjectId
) => {
  const budgetRecordList = await BudgetModel.find({
    userId: userRecord._id,
    "categories.categoryId": categoryId,
  });

  await Promise.all(
    budgetRecordList.map((budgetRecord) => {
      const { idx } = findById(budgetRecord, categoryId);
      if (idx !== -1) {
        budgetRecord.categories.splice(idx, 1);
        budgetRecord.markModified("categories");
        budgetRecord.save();
      }
    })
  );
};
