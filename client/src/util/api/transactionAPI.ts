const { DURING_SERVER } = import.meta.env;
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
  updateBudget?: boolean;
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
  const url = `${BASE_URL}?budgetId=${encodeURIComponent(budgetId)}`;
  const response = await fetch(url, {
    credentials: 'include',
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Response(
      `Failed to get transactions.\n${data.message ? data.message : ''}`,
      { status: response.status }
    );
  }

  return response.json() as Promise<{ transactions: TransactionType[] }>;
};

/** request - CREATE */
export const createTransaction = async (transaction: TransactionType) => {
  const url = `${BASE_URL}`;

  const response = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(transaction),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(`Failed to create transaction.\n${data.message ? data.message : ''}`);
  }

  return response.json() as Promise<{
    transaction: TransactionDataType;
    transactionScheduled: TransactionDataType;
    budget: BudgetDataType;
    assets: AssetDataType[];
  }>;
};

/** request - DELETE */
export const deleteTransaction = async (transactionId: string) => {
  const url = `${BASE_URL}/${encodeURIComponent(transactionId)}`;
  const response = await fetch(url, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Response(
      `Failed to get transactions.\n${data.message ? data.message : ''}`,
      { status: response.status }
    );
  }

  return response.json() as Promise<{
    transactionLinked: TransactionDataType;
    budget: BudgetDataType;
    assets: AssetDataType[];
  }>;
};

/** request - UPDATE */
export const updateTransaction = async (transaction: TransactionType) => {
  const url = `${BASE_URL}/${transaction._id}`;

  const response = await fetch(url, {
    method: 'PUT',
    credentials: 'include',
    body: JSON.stringify(transaction),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(`Failed to create transaction.\n${data.message ? data.message : ''}`);
  }

  return response.json() as Promise<{
    transaction: TransactionDataType;
    transactionLinked: TransactionDataType;
    budget: BudgetDataType;
    assets: AssetDataType[];
  }>;
};
