import { checkNetwork } from '../network';
import { BudgetCategoryType, UpdatedBudgetCategoryType } from './categoryAPI';
import { TransactionDataType } from './transactionAPI';

const { DURING_SERVER } = import.meta.env;

const BASE_URL = `${DURING_SERVER}/api/budgets`;

export interface BudgetDataType {
  _id: string;
  userId: string;
  title: string;
  startDate: string;
  endDate: string;
  expenseCurrent: number;
  expenseScheduled: number;
  expenseScheduledRemain: number;
  expensePlanned: number;
  incomeCurrent: number;
  incomeScheduled: number;
  incomeScheduledRemain: number;
  incomePlanned: number;
  categories: BudgetCategoryType[];
}

/** 기본 예산 정보 바탕으로 특정 년/월의 예산 생성 */
export const createBudgetFromBasic = async (year: number, month: number) => {
  checkNetwork();

  const url = `${BASE_URL}/basic`;

  let response, data;
  try {
    response = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({
        year,
        month,
        title: month + '월',
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
      data?.message || '기본 예산 바탕으로 예산 생성 중 문제가 발생했습니다.'
    );
  }

  return data as { budget: BudgetDataType };
};

/** 전체 Budget 목록 조회 */
export const getBudgetList = async () => {
  checkNetwork();

  const url = BASE_URL;

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
    throw new Error(data?.message || '전체 예산 목록 조회 중 문제가 발생했습니다.');
  }

  return data as { budgets: BudgetDataType[] };
};

/** 월 기준으로 Budget 조회 */
export const getBudgetByMonth = async (year: number, month: number) => {
  checkNetwork();

  const url = `${BASE_URL}/?year=${year}&month=${month}`;

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
    throw new Error(
      data?.message || `${year}년 ${month}월 예산 조회 요청 중 오류가 발생했습니다.`
    );
  }

  return data as { budget: BudgetDataType };
};

/** id 기준으로 Budget 조회 */
export const getBudgetById = async (id: string) => {
  checkNetwork();

  const url = `${BASE_URL}/${encodeURIComponent(id)}`;

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
    throw new Error(data?.message || '예산 조회 중 문제가 발생했습니다.');
  }

  return data as {
    budget: BudgetDataType;
    transactions: TransactionDataType[];
  };
};

/** 예산 정보 업데이트 */
export const updateBudgetFields = async (id: string, fields: any) => {
  checkNetwork();

  const url = `${BASE_URL}/${encodeURIComponent(id)}`;

  let response, data;
  try {
    response = await fetch(url, {
      method: 'PATCH',
      credentials: 'include',
      body: JSON.stringify(fields),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    data = await response.json();
  } catch (error) {
    throw error;
  }

  if (!response.ok) {
    throw new Error(data?.message || '예산 업데이트 중 문제가 발생했습니다.');
  }

  return data as { budget: BudgetDataType };
};

/** 예산 내 카테고리 목표 금액 업데이트 */
export const updateCategoryPlan = async (
  budgetId: string,
  categoryId: string,
  amount: number
) => {
  checkNetwork();

  const url = `${BASE_URL}/${budgetId}/categories/${categoryId}/amountPlanned`;

  let response, data;
  try {
    response = await fetch(url, {
      method: 'PUT',
      credentials: 'include',
      body: JSON.stringify({
        amountPlanned: amount,
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
      data?.message || '카테고리 목표 금액 업데이트 중 문제가 발생했습니다.'
    );
  }

  return data as { budget: BudgetDataType };
};

/** 예산 내 카테고리 업데이트 */
export const updateBudgetCategories = async (
  budgetId: string,
  isExpense: boolean,
  categories: {
    categoryId: string;
    amountPlanned: number;
  }[]
) => {
  checkNetwork();

  const url = `${BASE_URL}/${budgetId}/categories`;

  let response, data;
  try {
    response = await fetch(url, {
      method: 'PATCH',
      credentials: 'include',
      body: JSON.stringify({
        isExpense,
        isIncome: !isExpense,
        categories,
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
    throw new Error(data?.message || '예산 카테고리 업데이트 중 문제가 발생했습니다.');
  }

  return data as UpdatedBudgetCategoryType;
};
