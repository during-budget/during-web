import { HydratedDocument, Types } from "mongoose";

import { ICategory, IUser, User as UserModel } from "src/models/User";
import { ITransaction } from "src/models/Transaction";

import * as BudgetService from "./budget";
import * as TransactionService from "./transaction";

import { generateRandomString } from "src/utils/randomString";
import { findDocumentById } from "src/utils/document";

/* auth: localLogin, snsId */

type snsType = "google" | "naver" | "kakao";

export const isLocalLoginActive = (userRecord: HydratedDocument<IUser>) =>
  userRecord.isLocal;

export const checkSnsIdActive = (
  userRecord: HydratedDocument<IUser>,
  sns: snsType
) => userRecord.snsId && sns in userRecord.snsId && userRecord.snsId[sns];

export const countActiveSnsId = (userRecord: HydratedDocument<IUser>) => {
  let cnt = 0;
  if (checkSnsIdActive(userRecord, "google")) cnt += 1;
  if (checkSnsIdActive(userRecord, "naver")) cnt += 1;
  if (checkSnsIdActive(userRecord, "kakao")) cnt += 1;
  return cnt;
};

export const hasActiveSnsId = (userRecord: HydratedDocument<IUser>) =>
  countActiveSnsId(userRecord) > 0;

export const disableLocalLogin = async (
  userRecord: HydratedDocument<IUser>
) => {
  userRecord.isLocal = false;
  await userRecord.save();
};

export const updateSnsId = async (
  userRecord: HydratedDocument<IUser>,
  sns: snsType,
  id: string
) => {
  userRecord.snsId = { ...userRecord.snsId, [sns]: id };
  userRecord.isGuest = false;
  await userRecord.save();
};

export const updateEmailAndActivateLocalLogin = async (
  userRecord: HydratedDocument<IUser>,
  email: string
) => {
  userRecord.email = email;
  userRecord.isLocal = true;
  userRecord.isGuest = false;
  await userRecord.save();
};

export const removeSnsId = async (
  userRecord: HydratedDocument<IUser>,
  sns: snsType
) => {
  userRecord.snsId = { ...userRecord.snsId, [sns]: undefined };
  await userRecord.save();
};

export const isGuest = (userRecord: IUser) => userRecord.isGuest;

/* auth: admin */

export const findAdmin = async (id: string) => {
  const userRecord = await UserModel.findOne({
    ["snsId.google"]: id,
    auth: "admin",
  });

  return { user: userRecord };
};

export const isAdmin = async (userRecord: IUser) => userRecord.auth === "admin";

/* create user */

export const createUser = async (field: object) => {
  const userRecord = await UserModel.create(field);
  const { budget: budgetRecord } = await BudgetService.createBasicBudget(
    userRecord
  );
  userRecord.basicBudgetId = budgetRecord._id;
  await userRecord.save();
  return { user: userRecord };
};

export const createGuest = async () => {
  const { user } = await createUser({
    userName: "guest-" + generateRandomString(5),
    isGuest: true,
  });
  return { user };
};

export const createLocalUser = async (email: string) => {
  const { user } = await createUser({
    email,
    isLocal: true,
  });
  return { user };
};

export const createSnsUser = async (
  sns: snsType,
  profile: { id: string; email?: string; displayName?: string }
) => {
  const { user } = await createUser({
    userName: profile.displayName,
    email: profile.email,
    snsId: { [sns]: profile.id },
  });
  return { user };
};

/* find users */

export const findAll = async () => {
  const userRecordList = await UserModel.find({})
    .lean()
    .select(["email", "userName", "snsId", "createdAt", "updatedAt"]);

  return { users: userRecordList };
};

export const findById = async (_id: Types.ObjectId | string) => {
  const userRecord = await UserModel.findById(_id);

  return { user: userRecord };
};

export const findBySnsId = async (sns: snsType, id: string) => {
  const userRecord = await UserModel.findOne({ ["snsId." + sns]: id });

  return { user: userRecord };
};

export const findByEmail = async (email: string) => {
  const userRecord = await UserModel.findOne({ email });

  return { user: userRecord };
};

/* find category/paymentMethod/asset/card of users */

export const findDefaultExpenseCategory = (userRecord: IUser) => {
  return {
    category: userRecord.categories[userRecord.categories.length - 2],
  };
};

export const findDefaultIncomeCategory = (userRecord: IUser) => {
  return {
    category: userRecord.categories[userRecord.categories.length - 1],
  };
};

export const createCategory = async (
  userRecord: HydratedDocument<IUser>,
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

export const findCategory = (
  userRecord: IUser,
  categoryId: string | Types.ObjectId
) => {
  const { idx, value } = findDocumentById({
    arr: userRecord.categories,
    id: categoryId,
  });
  return { idx, category: value };
};

export const updateCategory = async (
  userRecord: HydratedDocument<IUser>,
  category: ICategory,
  fields: { title: string; icon: string }
) => {
  category.title = fields.title;
  category.icon = fields.icon;
  await userRecord.save();
};

export const updateCategoriesAll = async (
  userRecord: HydratedDocument<IUser>,
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

export const updateCategoriesPartially = async (
  userRecord: HydratedDocument<IUser>,
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

export const removeCategoryByIdx = async (
  userRecord: HydratedDocument<IUser>,
  idx: number
) => {
  userRecord.categories.splice(idx, 1);
  await userRecord.save();
};

export const getCategories = (userRecord: IUser) => {
  const categories = userRecord.categories;
  return { categories };
};

export const findPaymentMethod = (
  userRecord: IUser,
  paymentMethodId: string | Types.ObjectId
) => {
  const { idx, value } = findDocumentById({
    arr: userRecord.paymentMethods,
    id: paymentMethodId,
  });
  return { idx, paymentMethod: value };
};

export const findAsset = (userRecord: IUser, _id: Types.ObjectId) => {
  const { idx, value } = findDocumentById({
    arr: userRecord.assets,
    id: _id,
  });
  return { idx, asset: value };
};

export const findCard = (userRecord: IUser, _id: Types.ObjectId) => {
  const { idx, value } = findDocumentById({
    arr: userRecord.cards,
    id: _id,
  });
  return { idx, card: value };
};

/* update */

export const updateFields = async (
  userRecord: HydratedDocument<IUser>,
  user: {
    userName: string;
    birthdate: Date;
    gender: string;
    tel: string;
  }
) => {
  userRecord.userName = user.userName;
  userRecord.birthdate = user.birthdate;
  userRecord.gender = user.gender;
  userRecord.tel = user.tel;
  await userRecord.save();
};

export const updateAgreement = async (
  userRecord: HydratedDocument<IUser>,
  agreement: {
    termsOfUse?: string;
    privacyPolicy?: string;
  }
) => {
  userRecord.agreement = {
    termsOfUse: agreement.termsOfUse,
    privacyPolicy: agreement.privacyPolicy,
  };

  await userRecord.save();
};

export const updateAssetByTransaction = async (
  userRecord: HydratedDocument<IUser>,
  assetId: Types.ObjectId,
  transactionRecord: HydratedDocument<ITransaction>
) => {
  const { asset } = findAsset(userRecord, assetId);
  if (asset) {
    if (transactionRecord.isExpense) asset.amount -= transactionRecord.amount;
    else asset.amount += transactionRecord.amount;
    await userRecord.save();
  }
};

/* exec/cancel payment method */

export const execPaymentMethod = async (
  userRecord: HydratedDocument<IUser>,
  transactionRecord: HydratedDocument<ITransaction>
) => {
  if (!transactionRecord.linkedPaymentMethodId) return;

  let assetId: Types.ObjectId | null = null;

  if (transactionRecord.linkedPaymentMethodType === "asset") {
    assetId = transactionRecord.linkedPaymentMethodId;
  } else if (transactionRecord.linkedPaymentMethodType === "card") {
    const { card } = findCard(
      userRecord,
      transactionRecord.linkedPaymentMethodId
    );
    if (card && card.linkedAssetId) {
      assetId = card.linkedAssetId;
    }
  }

  if (assetId) {
    await updateAssetByTransaction(userRecord, assetId, transactionRecord);
  }
};

/* remove */

export const remove = async (userRecord: HydratedDocument<IUser>) => {
  await Promise.all([
    TransactionService.removeByUserId(userRecord._id),
    BudgetService.removeByUserId(userRecord._id),
    userRecord.remove(),
  ]);
};
