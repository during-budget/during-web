import { BudgetCategoryType, UserCategoryType } from '../util/api/categoryAPI';
import Amount from './Amount';
import { v4 as uuid } from 'uuid';

class Category {
  private _id: string;
  private _title: string;
  private _icon: string;
  private _isExpense: boolean;
  private _isDefault: boolean;
  private _amount: Amount;

  constructor(category: {
    id: string;
    title: string;
    icon: string;
    isExpense: boolean;
    isDefault: boolean;
    amount?: Amount;
  }) {
    const { id, title, icon, isExpense, isDefault, amount } = category;
    this._id = id;
    this._title = title;
    this._icon = icon;
    this._isExpense = isExpense;
    this._isDefault = isDefault;
    this._amount = amount ? amount : new Amount(0, 0, 0);
  }

  get id() {
    return this._id;
  }

  get title() {
    return this._title;
  }

  get icon() {
    return this._icon;
  }

  get isExpense() {
    return this._isExpense;
  }

  get isDefault() {
    return this._isDefault;
  }

  get amount() {
    return this._amount;
  }

  set icon(icon: string) {
    this._icon = icon;
  }

  set title(title: string) {
    this._title = title;
  }

  set amount(amount: Amount) {
    this._amount = amount;
  }

  static getCategoryFromData = (category: UserCategoryType | BudgetCategoryType) => {
    const {
      categoryId,
      _id,
      icon,
      isExpense,
      isDefault,
      title,
      amountCurrent,
      amountPlanned,
      amountScheduled,
    } = category;

    const amount = new Amount(
      amountCurrent || 0,
      amountScheduled || 0,
      amountPlanned || 0
    );

    return new Category({
      id: categoryId || _id,
      title,
      icon,
      isExpense,
      isDefault,
      amount,
    });
  };

  static getEmptyCategory = () => {
    return new Category({
      id: uuid(),
      title: '',
      icon: '',
      isExpense: true,
      isDefault: false,
    });
  };

  static clone(
    instance: Category | undefined,
    updatingOpts?: Partial<Category>
  ): Category {
    if (!instance) return this.getEmptyCategory();

    const { id, title, icon, isExpense, isDefault, amount } = instance;
    return new Category({
      id,
      title,
      icon,
      isExpense,
      isDefault,
      amount,
      ...updatingOpts,
    });
  }

  static getCategoryUpdatedAmount({
    prevCategory,
    current,
    scheduled,
    planned,
  }: {
    prevCategory: Category;
    current?: number;
    scheduled?: number;
    planned?: number;
  }) {
    const prevAmount = prevCategory.amount;

    const {
      current: prevCurrent,
      scheduled: prevScheduled,
      planned: prevPlanned,
    } = prevAmount;

    const amount = new Amount(
      current !== undefined ? current + prevCurrent : prevCurrent,
      scheduled !== undefined ? scheduled + prevScheduled : prevScheduled,
      planned !== undefined ? planned : prevPlanned
    );

    return this.clone(prevCategory, { amount });
  }
}

export default Category;
