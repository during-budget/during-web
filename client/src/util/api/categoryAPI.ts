const { DURING_SERVER } = import.meta.env;
import { validate as isUUID } from 'uuid';
import Category from '../../models/Category';

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
}
export interface BudgetCategoryType extends CategoryBaisis {
  _id: never;
  categoryId: string;
  amountCurrent: number;
  amountPlanned: number;
  amountScheduled: number;
}

export interface TransactionCategoryType extends CategoryBaisis {
  _id: never;
  categoryId: string;
  amountCurrent: never;
  amountPlanned: never;
  amountScheduled: never;
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

export const getCategories = async () => {
  const response = await fetch(BASE_URL, {
    credentials: 'include',
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Response(`Failed to get categories.\n${data.message ? data.message : ''}`, {
      status: response.status,
    });
  }

  return response.json() as Promise<UserCategoryType[]>;
};

export const updateCategories = async (data: { categoryData: Category[] }) => {
  const { categoryData } = data;

  const response = await fetch(BASE_URL, {
    method: 'PUT',
    credentials: 'include',
    body: JSON.stringify({ categories: convertCategory(categoryData) }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const data = await response.json();

    throw new Error(`Failed to update categories.\n${data.message ? data.message : ''}`);
  }

  return response.json() as Promise<UpdatedUserCategoryType>;
};

export const updateCategoriesPartially = async (data: {
  isExpense?: boolean;
  categories: Category[];
}) => {
  const { isExpense, categories } = data;

  const response = await fetch(BASE_URL, {
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

  if (!response.ok) {
    const data = await response.json();

    throw new Error(`Failed to update categories.\n${data.message ? data.message : ''}`);
  }

  return response.json() as Promise<UpdatedUserCategoryType>;
};

const convertCategory = (categoryData: Category[]) => {
  return categoryData.map((category) => {
    const { id, isExpense, icon, title } = category;

    return {
      _id: isUUID(id) ? undefined : id,
      isExpense,
      isIncome: !isExpense,
      icon,
      title,
    };
  });
};
