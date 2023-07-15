const { DURING_SERVER } = import.meta.env;
import { validate as isUUID } from 'uuid';
import Category from '../../models/Category';
import { checkNetwork } from '../network';

const BASE_URL = `${DURING_SERVER}/api/categories`;

interface CategoryBaisis {
  icon: string;
  isExpense: boolean;
  isIncome: boolean;
  isDefault: boolean;
  title: string;
}

export interface UserCategoryType extends CategoryBaisis {
  _id: string;
  categoryId: never;
  amountCurrent: never;
  amountPlanned: never;
  amountScheduled: never;
  amountScheduledRemain: never;
}
export interface BudgetCategoryType extends CategoryBaisis {
  _id: never;
  categoryId: string;
  amountCurrent: number;
  amountPlanned: number;
  amountScheduled: number;
  amountScheduledRemain: number;
}

export interface TransactionCategoryType extends Omit<CategoryBaisis, 'isDefault'> {
  categoryId: string;
}

export interface UpdatedBudgetCategoryType {
  categories: BudgetCategoryType[];
  included: BudgetCategoryType[];
  updated: BudgetCategoryType[];
  excluded: BudgetCategoryType[];
}

export interface UpdatedUserCategoryType {
  categories: UserCategoryType[];
  added: UserCategoryType[];
  updated: UserCategoryType[];
  removed: UserCategoryType[];
}

export const createCategory = async (
  category: Pick<CategoryBaisis, 'isExpense' | 'title' | 'icon'>
) => {
  checkNetwork();

  let response, data;

  const { isExpense, title, icon } = category;

  try {
    response = await fetch(BASE_URL, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({
        isExpense,
        title,
        icon,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    data = await response.json();
  } catch (error) {
    throw error;
  }

  if (!response.ok) {
    throw new Error(data?.message || `카테고리 생성 중 문제가 발생했습니다: ${title}`);
  }

  return data as { category: UserCategoryType };
};

export const getCategory = async (id?: string) => {
  checkNetwork();

  const url = `${BASE_URL}${id ? '/' + id : ''}`;
  let response, data;

  try {
    response = await fetch(url, {
      credentials: 'include',
    });
    data = await response.json();
  } catch (error) {
    throw error;
  }

  if (!response.ok) {
    throw new Error(data?.message || '카테고리 목록 조회 중 문제가 발생했습니다.');
  }
  return data as UserCategoryType[] | { category: UserCategoryType };
};

export const updateCategories = async (categories: { categoryData: Category[] }) => {
  checkNetwork();

  const { categoryData } = categories;

  let response, data;
  try {
    response = await fetch(BASE_URL, {
      method: 'PUT',
      credentials: 'include',
      body: JSON.stringify({ categories: convertCategory(categoryData) }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    data = await response.json();
  } catch (error) {
    throw error;
  }

  if (!response.ok) {
    throw new Error(data?.message || '카테고리 업데이트 중 문제가 발생했습니다.');
  }

  return data as UpdatedUserCategoryType;
};

export const updateCategoriesPartially = async (updatingData: {
  isExpense?: boolean;
  categories: Category[];
}) => {
  checkNetwork();

  const { isExpense, categories } = updatingData;

  let response, data;
  try {
    response = await fetch(BASE_URL, {
      method: 'PATCH',
      credentials: 'include',
      body: JSON.stringify({
        isExpense,
        isIncome: !isExpense,
        categories: convertCategory(categories),
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    data = await response.json();
  } catch (error) {
    throw error;
  }

  if (!response.ok) {
    throw new Error(
      data?.message || '지출/수입 카테고리 업데이트 중 문제가 발생했습니다.'
    );
  }

  return data as UpdatedUserCategoryType;
};

export const convertCategory = (categoryData: Category[]) => {
  checkNetwork();

  return categoryData.map((category) => {
    const { id, isExpense } = category;

    return {
      ...Category.convertToObj(category),
      _id: isUUID(id) ? undefined : id,
      isIncome: !isExpense,
      amount: undefined,
    };
  });
};
