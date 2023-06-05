const { DURING_SERVER } = import.meta.env;
import { checkNetwork } from '../network';
import { AssetDataType } from './assetAPI';
import { BudgetDataType } from './budgetAPI';
import { TransactionCategoryType } from './categoryAPI';

const BASE_URL = `${DURING_SERVER}/api/transactions`;

export interface TransactionType {
  _id: string;
  budgetId: string; // NOTE: transactionForm에서 요청을 위해 필요함
  date: Date | null;
  isExpense: boolean;
  isIncome?: boolean;
  isCurrent: boolean;
  icon: string;
  title: string[];
  amount: number;
  categoryId: string;
  linkedPaymentMethodId?: string;
  tags: string[];
  memo: string;
  linkId?: string;
  overAmount?: number;
  updateAsset?: boolean;
}

export interface TransactionDataType extends TransactionType {
  createdAt: string;
  userId: string;
  category: TransactionCategoryType;
  categoryId: never;
}

/** convert: TransactionData -> Transaction */
export const convertTransactionFromData = (data: TransactionDataType) => {
  const transaction: TransactionType = data;

  transaction.categoryId = data.category.categoryId;
  transaction.date = data.date ? new Date(data.date) : null;

  return transaction;
};

/** request - GET */
export const getTransactions = async (budgetId: string) => {
  checkNetwork();

  const url = `${BASE_URL}?budgetId=${encodeURIComponent(budgetId)}`;
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
    throw new Error(data?.message || '내역 조회 중 문제가 발생했습니다.');
  }

  return data as { transactions: TransactionDataType[] };
};

/** request - CREATE */
export const createTransaction = async (transaction: TransactionType) => {
  checkNetwork();

  let response, data;
  try {
    response = await fetch(BASE_URL, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(transaction),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    data = await response.json();
  } catch (error) {
    throw error;
  }

  if (!response.ok) {
    throw new Error(data?.message || '내역 생성 중 문제가 발생했습니다.');
  }

  return data as {
    transaction: TransactionDataType;
    transactionScheduled: TransactionDataType;
    budget: BudgetDataType;
    assets: AssetDataType[];
  };
};

/** request - DELETE */
export const deleteTransaction = async (transactionId: string) => {
  checkNetwork();

  const url = `${BASE_URL}/${encodeURIComponent(transactionId)}`;

  let response, data;

  try {
    response = await fetch(url, {
      method: 'DELETE',
      credentials: 'include',
    });
    data = await response.json();
  } catch (error) {
    throw error;
  }

  if (!response.ok) {
    throw new Error(data?.message || '내역 삭제 중 문제가 발생했습니다.');
  }

  return data as {
    transactionLinked: TransactionDataType;
    budget: BudgetDataType;
    assets: AssetDataType[];
  };
};

/** request - UPDATE */
export const updateTransaction = async (transaction: TransactionType) => {
  checkNetwork();

  const url = `${BASE_URL}/${transaction._id}`;

  let response, data;
  try {
    response = await fetch(url, {
      method: 'PUT',
      credentials: 'include',
      body: JSON.stringify(transaction),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    data = await response.json();
  } catch (error) {
    throw error;
  }

  if (!response.ok) {
    throw new Error(data?.message || '내역 업데이트 중 문제가 발생했습니다.');
  }

  return data as {
    transaction: TransactionDataType;
    transactionLinked: TransactionDataType;
    budget: BudgetDataType;
    assets: AssetDataType[];
  };
};
