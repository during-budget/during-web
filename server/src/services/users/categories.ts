import { HydratedDocument, Types } from "mongoose";
import { ICategory, UserEntity } from "src/models/user.model";

import { findDocumentById } from "src/utils/document";

export const findDefaultExpenseCategory = (userRecord: UserEntity) => {
  return {
    category: userRecord.categories[userRecord.categories.length - 2],
  };
};

export const findDefaultIncomeCategory = (userRecord: UserEntity) => {
  return {
    category: userRecord.categories[userRecord.categories.length - 1],
  };
};

export const create = async (
  userRecord: HydratedDocument<UserEntity>,
  category: {
    isExpense: boolean;
    isIncome: boolean;
    title?: string;
    icon?: string;
  }
) => {
  const { category: defaultExpenseCategory } =
    findDefaultExpenseCategory(userRecord);
  const { category: defaultIncomeCategory } =
    findDefaultIncomeCategory(userRecord);

  const categories = userRecord.categories.filter(
    (category) => !category.isDefault
  );
  const idx = categories.length;

  userRecord.categories = new Types.DocumentArray([
    ...categories,
    category,
    defaultExpenseCategory,
    defaultIncomeCategory,
  ]);

  await userRecord.save();
  return { category: userRecord.categories[idx] };
};

export const findById = (
  userRecord: UserEntity,
  categoryId: string | Types.ObjectId
) => {
  const { idx, value } = findDocumentById({
    arr: userRecord.categories,
    id: categoryId,
  });
  return { idx, category: value };
};

export const update = async (
  userRecord: HydratedDocument<UserEntity>,
  category: ICategory,
  fields: { title: string; icon: string }
) => {
  category.title = fields.title;
  category.icon = fields.icon;
  await userRecord.save();
};

export const updateAll = async (
  userRecord: HydratedDocument<UserEntity>,
  categories: { _id?: string; title: string; icon: string }[]
) => {
  const categoryDict: { [key: string]: ICategory } = Object.fromEntries(
    userRecord.categories.map((category: any) => [
      category._id,
      category.toObject(),
    ])
  );

  const _categories: Types.DocumentArray<ICategory> = new Types.DocumentArray(
    []
  );

  const added: Types.DocumentArray<ICategory> = new Types.DocumentArray([]);
  const updated: Types.DocumentArray<ICategory> = new Types.DocumentArray([]);
  const removed: Types.DocumentArray<ICategory> = new Types.DocumentArray([]);

  let { category: defaultExpenseCategory } =
    findDefaultExpenseCategory(userRecord);
  let { category: defaultIncomeCategory } =
    findDefaultIncomeCategory(userRecord);

  for (let _category of categories) {
    /* create category */
    if (!("_id" in _category)) {
      const isExpense = "isExpense" in _category ? _category.isExpense : false;
      const isIncome = "isIncome" in _category ? _category.isIncome : false;
      if (isExpense !== isIncome) {
        const category = {
          isExpense,
          isIncome,
          isDefault: false,
          title: _category.title,
          icon: _category.icon,
        };
        _categories.push(category);
        added.push(category);
      }
    } else {
      /* update category */
      const key = _category._id!;
      const exCategory = categoryDict[key];
      if (exCategory) {
        const category = {
          ...exCategory,
          title: _category.title,
          icon: _category.icon,
        };

        if (!exCategory.isDefault) {
          _categories.push(category);
        } else {
          if (exCategory.isExpense) {
            defaultExpenseCategory = category;
          } else {
            defaultIncomeCategory = category;
          }
        }

        if (
          exCategory.title !== category.title ||
          exCategory.icon !== category.icon
        ) {
          updated.push(category);
        }
      }

      delete categoryDict[key];
    }
  }
  /* remove category */
  for (const category of Object.values(categoryDict)) {
    if (!category.isDefault) {
      removed.push(category);
    }
  }

  userRecord.categories = new Types.DocumentArray([
    ..._categories,
    defaultExpenseCategory,
    defaultIncomeCategory,
  ]);

  await userRecord.save();
  return { added, updated, removed };
};

export const updatePartially = async (
  userRecord: HydratedDocument<UserEntity>,
  isExpense: boolean,
  isIncome: boolean,
  categories: { _id?: string; title: string; icon: string }[]
) => {
  const categoryDict: { [key: string]: ICategory } = Object.fromEntries(
    userRecord.categories.map((category: any) => [
      category._id,
      category.toObject(),
    ])
  );

  const _categories: Types.DocumentArray<ICategory> = new Types.DocumentArray(
    []
  );

  const added: Types.DocumentArray<ICategory> = new Types.DocumentArray([]);
  const updated: Types.DocumentArray<ICategory> = new Types.DocumentArray([]);
  const removed: Types.DocumentArray<ICategory> = new Types.DocumentArray([]);

  let { category: defaultExpenseCategory } =
    findDefaultExpenseCategory(userRecord);
  let { category: defaultIncomeCategory } =
    findDefaultIncomeCategory(userRecord);

  for (let _category of categories) {
    /* create category */
    if (!("_id" in _category)) {
      const category = {
        isExpense,
        isIncome,
        isDefault: false,
        title: _category.title,
        icon: _category.icon,
      };
      _categories.push(category);
      added.push(category);
    } else {
      /* update category */
      const key = _category._id!;
      const exCategory = categoryDict[key];
      if (exCategory && exCategory.isExpense === isExpense) {
        const category = {
          ...exCategory,
          title: _category.title,
          icon: _category.icon,
        };

        if (!exCategory.isDefault) {
          _categories.push(category);
        } else {
          if (exCategory.isExpense) {
            defaultExpenseCategory = category;
          } else {
            defaultIncomeCategory = category;
          }
        }

        if (
          exCategory.title !== category.title ||
          exCategory.icon !== category.icon
        ) {
          updated.push(category);
        }
      }

      delete categoryDict[key];
    }
  }
  /* remove category */
  for (const category of Object.values(categoryDict)) {
    if (!category.isDefault) {
      if (category.isExpense === isExpense) {
        removed.push(category);
      } else {
        _categories.push(category);
      }
    }
  }

  userRecord.categories = new Types.DocumentArray([
    ..._categories,
    defaultExpenseCategory,
    defaultIncomeCategory,
  ]);

  await userRecord.save();
  return { added, updated, removed };
};

export const removeByIdx = async (
  userRecord: HydratedDocument<UserEntity>,
  idx: number
) => {
  userRecord.categories.splice(idx, 1);
  await userRecord.save();
};
