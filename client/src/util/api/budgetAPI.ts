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
  const url = `${BASE_URL}/basic`;
  const response = await fetch(url, {
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

  if (!response.ok) {
    const data = await response.json();
    throw new Response(
      `Failed to create budgets from basic.\n${data.message ? data.message : ''}`,
      { status: response.status }
    );
  }

  return response.json() as Promise<{ budget: BudgetDataType }>;
};

/** 전체 Budget 목록 조회 */
export const getBudgetList = async () => {
  const url = BASE_URL;
  const response = await fetch(url, {
    credentials: 'include',
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Response(`Failed to get budgets.\n${data.message ? data.message : ''}`, {
      status: response.status,
    });
  }

  return response.json() as Promise<{ budgets: BudgetDataType[] }>;
};

/** 연도 기준으로 Budget 목록 조회 */
export const getBudgetByYear = async (year: number) => {
  const url = `${BASE_URL}?year=${year}`;
  const response = await fetch(url, {
    credentials: 'include',
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Response(
      `Failed to get budgets by date.\n${data.message ? data.message : ''}`,
      {
        status: response.status,
      }
    );
  }

  return response.json() as Promise<{ budgets: BudgetDataType[] }>;
};

/** 월 기준으로 Budget 목록 조회 */
export const getBudgetByMonth = async (year: number, month: number) => {
  const url = `${BASE_URL}?year=${year}&month=${month}`;
  const response = await fetch(url, {
    credentials: 'include',
  });

  const status = response.status;
  if (status === 404) {
    return { budget: null };
  }

  if (!response.ok) {
    const data = await response.json();
    throw new Response(
      `Failed to get budgets by date.\n${data.message ? data.message : ''}`,
      {
        status: response.status,
      }
    );
  }

  return response.json() as Promise<{ budget: BudgetDataType }>;
};

/** id 기준으로 Budget 조회 */
export const getBudgetById = async (id: string) => {
  const url = `${BASE_URL}/${encodeURIComponent(id)}`;
  const response = await fetch(url, {
    credentials: 'include',
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Response(`Failed to get budgets.\n${data.message ? data.message : ''}`, {
      status: response.status,
    });
  }

  // TODO: transactionsDataType 정의
  return response.json() as Promise<{
    budget: BudgetDataType;
    transactions: TransactionDataType[];
  }>;
};

/** 예산 정보 업데이트 */
export const updateBudgetFields = async (id: string, data: any) => {
  const url = `${BASE_URL}/${encodeURIComponent(id)}`;
  const response = await fetch(url, {
    method: 'PATCH',
    credentials: 'include',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Response(
      `Failed to patch budget fields.\n${data.message ? data.message : ''}`,
      { status: response.status }
    );
  }

  return response.json() as Promise<{ budget: BudgetDataType }>;
};

/** 예산 내 카테고리 목표 금액 업데이트 */
export const updateCategoryPlan = async (
  budgetId: string,
  categoryId: string,
  amount: number
) => {
  const url = `${BASE_URL}/${budgetId}/categories/${categoryId}/amountPlanned`;
  const response = await fetch(url, {
    method: 'PUT',
    credentials: 'include',
    body: JSON.stringify({
      amountPlanned: amount,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Response(
      `Failed to patch category plan.\n${data.message ? data.message : ''}`,
      { status: response.status }
    );
  }

  return response.json() as Promise<{ budget: BudgetDataType }>;
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
  const url = `${BASE_URL}/${budgetId}/categories`;
  const response = await fetch(url, {
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

  if (!response.ok) {
    const data = await response.json();
    throw new Response(
      `Failed to patch category plan.\n${data.message ? data.message : ''}`,
      { status: response.status }
    );
  }

  return response.json() as Promise<UpdatedBudgetCategoryType>;
};
