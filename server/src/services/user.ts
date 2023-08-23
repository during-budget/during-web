import { HydratedDocument, Types } from "mongoose";

import { IAsset, ICategory, IUser, User as UserModel } from "src/models/User";
import { ITransaction } from "src/models/Transaction";

import * as BudgetService from "./budget";
import * as TransactionService from "./transaction";

import { generateRandomString } from "src/utils/randomString";
import { findDocumentById } from "src/utils/document";

/* static */

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

export const findAdmin = async (id: string) => {
  const userRecord = await UserModel.findOne({
    ["snsId.google"]: id,
    auth: "admin",
  });

  return { user: userRecord };
};

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

/* methods */

/* auth: localLogin, snsId */

type snsType = "google" | "naver" | "kakao";

export const isAdmin = async (userRecord: IUser) => userRecord.auth === "admin";

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

/* categories */

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

/* paymentMethods */

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

/* assets */

export const findAsset = (userRecord: IUser, _id: Types.ObjectId | string) => {
  const { idx, value } = findDocumentById({
    arr: userRecord.assets,
    id: _id,
  });
  return { idx, asset: value };
};

export const createAsset = async (
  userRecord: HydratedDocument<IUser>,
  _asset: {
    icon?: string;
    title: string;
    amount?: number;
    detail?: string;
  }
) => {
  const asset = {
    _id: new Types.ObjectId(),
    icon: _asset.icon ?? "",
    title: _asset.title,
    amount: _asset.amount ?? 0,
    detail: _asset.detail ?? "",
  };

  userRecord.assets.push(asset);
  userRecord.paymentMethods.push({
    type: "asset",
    ...asset,
    isChecked: true,
  });

  await userRecord.save();
};

export const updateAsset = async (
  userRecord: HydratedDocument<IUser>,
  asset: IAsset,
  newAsset: {
    icon: string;
    title: string;
    amount: number;
    detail: string;
  }
) => {
  const isUpdatedIcon = asset.icon !== newAsset.icon;
  const isUpdatedTitle = asset.title !== newAsset.title;
  const isUpdatedDetail = asset.detail !== newAsset.detail;

  asset.icon = newAsset.icon;
  asset.title = newAsset.title;
  asset.amount = newAsset.amount;
  asset.detail = newAsset.detail;

  let isUpdatedCards = false;
  let isUpdatedPM = false;

  if (isUpdatedIcon || isUpdatedTitle) {
    for (let i = 0; i < userRecord.cards.length; i++) {
      if (userRecord.cards[i].linkedAssetId?.equals(asset._id)) {
        userRecord.cards[i].linkedAssetIcon = asset.icon;
        userRecord.cards[i].linkedAssetTitle = asset.title;
        isUpdatedCards = true;
      }
    }

    if (isUpdatedDetail) {
      const { idx: paymentMethodIdx } = findPaymentMethod(
        userRecord,
        asset._id
      );

      if (paymentMethodIdx !== -1) {
        userRecord.paymentMethods[paymentMethodIdx].icon = asset.icon;
        userRecord.paymentMethods[paymentMethodIdx].title = asset.title;
        userRecord.paymentMethods[paymentMethodIdx].detail = asset.detail;
        isUpdatedPM = true;

        /* update transactions */

        const { transactions: transactionRecordList } =
          await TransactionService.findByPaymentMethod(userRecord, asset._id);
        await Promise.all(
          transactionRecordList.map((transactionRecord) => {
            TransactionService.updatePaymentMethod(transactionRecord, {
              _id: asset._id,
              type: "asset",
              icon: asset.icon,
              title: asset.title,
              detail: asset.detail,
            });
          })
        );
      }
    }
  }

  await userRecord.save();
  return { isUpdatedCards, isUpdatedPM };
};

export const updateAssetAll = async (
  userRecord: HydratedDocument<IUser>,
  newAssets: any[]
) => {
  const assetDict: { [key: string]: IAsset } = Object.fromEntries(
    userRecord.assets.map((asset: any) => [asset._id, asset.toObject()])
  );

  const _assets: Types.DocumentArray<IAsset> = new Types.DocumentArray([]);

  const added: Types.DocumentArray<IAsset> = new Types.DocumentArray([]);
  const updated: Types.DocumentArray<IAsset> = new Types.DocumentArray([]);
  const removed: Types.DocumentArray<IAsset> = new Types.DocumentArray([]);

  let isUpdatedCards = false;
  let isUpdatedPM = false;

  for (let _asset of newAssets) {
    /* create asset */
    if (!("_id" in _asset)) {
      _asset._id = new Types.ObjectId();
      _assets.push(_asset);
      added.push(_asset);
    } else {
      /* update asset */
      const key = _asset._id;
      const exAsset = assetDict[key];
      if (exAsset) {
        const asset = {
          _id: exAsset._id,
          icon: _asset.icon ?? exAsset.icon,
          title: _asset.title ?? exAsset.title,
          amount: _asset.amount ?? 0,
          detail: _asset.detail ?? exAsset.detail,
        };
        _assets.push(asset);

        if (
          exAsset.icon !== asset.icon ||
          exAsset.title !== asset.title ||
          exAsset.detail !== asset.detail
        ) {
          updated.push(asset);
        }
      }

      delete assetDict[key];
    }
  }
  /* remove category */
  for (const asset of Object.values(assetDict)) {
    removed.push(asset);
  }

  isUpdatedPM = added.length > 0 || updated.length > 0 || removed.length > 0;
  userRecord.assets = _assets;
  await userRecord.save();

  for (const asset of added) {
    const key = asset._id;
    userRecord.paymentMethods.push({
      _id: key,
      type: "asset",
      icon: asset.icon,
      title: asset.title,
      detail: asset.detail,
      isChecked: true,
    });
  }

  for (const asset of updated) {
    const key = asset._id;
    for (let i = 0; i < userRecord.cards.length; i++) {
      if (userRecord.cards[i].linkedAssetId?.equals(key)) {
        userRecord.cards[i].linkedAssetIcon = asset.icon;
        userRecord.cards[i].linkedAssetTitle = asset.title;
        isUpdatedCards = true;
      }
    }
    const { idx: paymentMethodIdx } = findPaymentMethod(userRecord, asset._id);
    if (paymentMethodIdx !== -1) {
      userRecord.paymentMethods[paymentMethodIdx].icon = asset.icon;
      userRecord.paymentMethods[paymentMethodIdx].title = asset.title;
      userRecord.paymentMethods[paymentMethodIdx].detail = asset.detail;

      /* update transactions */
      const { transactions: transactionRecordList } =
        await TransactionService.findByPaymentMethod(userRecord, asset._id);
      await Promise.all(
        transactionRecordList.map((transactionRecord) => {
          TransactionService.updatePaymentMethod(transactionRecord, {
            _id: asset._id,
            type: "asset",
            icon: asset.icon,
            title: asset.title,
            detail: asset.detail,
          });
        })
      );
    }
  }

  for (const asset of removed) {
    const key = asset._id;
    for (let i = 0; i < userRecord.cards.length; i++) {
      if (userRecord.cards[i].linkedAssetId?.equals(key)) {
        userRecord.cards[i].linkedAssetId = undefined;
        userRecord.cards[i].linkedAssetIcon = undefined;
        userRecord.cards[i].linkedAssetTitle = undefined;
      }
    }

    const { idx: paymentMethodIdx } = findPaymentMethod(userRecord, asset._id);
    if (paymentMethodIdx !== -1) {
      userRecord.paymentMethods.splice(paymentMethodIdx, 1);
    }
  }
  await userRecord.save();
  return { isUpdatedCards, isUpdatedPM };
};

export const removeAssetByIdx = async (
  userRecord: HydratedDocument<IUser>,
  idx: number
) => {
  let isUpdatedCards = false;

  for (let i = 0; i < userRecord.cards.length; i++) {
    if (userRecord.cards[i].linkedAssetId?.equals(userRecord.assets[idx]._id)) {
      userRecord.cards[i].linkedAssetId = undefined;
      userRecord.cards[i].linkedAssetIcon = undefined;
      userRecord.cards[i].linkedAssetTitle = undefined;
      isUpdatedCards = true;
    }
  }

  const { idx: paymentMethodIdx } = findPaymentMethod(
    userRecord,
    userRecord.assets[idx]._id
  );
  if (paymentMethodIdx !== -1) {
    userRecord.paymentMethods.splice(paymentMethodIdx, 1);
  }
  userRecord.assets.splice(idx, 1);

  await userRecord.save();
  return { isUpdatedCards };
};

/* cards */

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
