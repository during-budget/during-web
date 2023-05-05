const { DURING_SERVER } = import.meta.env;
import Transaction from '../../models/Transaction';
import { TransactionCategoryType } from './categoryAPI';

const BASE_URL = `${DURING_SERVER}/api/transactions`;

export interface TransactionDataType {
    _id: string;
    userId: string;
    budgetId: string;
    date: string;
    isCurrent: boolean;
    isExpense: boolean;
    isIncome: boolean;
    linkId: string | null;
    icon: string;
    title: string[];
    amount: number;
    category: TransactionCategoryType;
    tags: string[];
    memo: string;
    createdAt: string;
    overAmount?: number;
}

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

    return response.json() as Promise<{ transactions: TransactionDataType[] }>;
};

export const createTransaction = async (transaction: Transaction) => {
    const url = `${BASE_URL}`;

    const {
        budgetId,
        linkId,
        date,
        isExpense,
        isCurrent,
        titles: title,
        amount,
        categoryId,
        tags,
        memo,
    } = transaction;

    const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({
            budgetId,
            linkId,
            date,
            isExpense,
            isCurrent,
            title,
            amount,
            categoryId,
            tags,
            memo,
            updateAsset: false
        }),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(
            `Failed to create transaction.\n${data.message ? data.message : ''}`
        );
    }

    return response.json() as Promise<{ transaction: TransactionDataType }>;
};

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
};

export const updateTransaction = async (transaction: Transaction) => {
    const url = `${BASE_URL}/${transaction.id}`;

    const {
        isCurrent,
        linkId,
        amount,
        date,
        icon,
        titles,
        categoryId,
        tags,
        memo,
    } = transaction;

    const response = await fetch(url, {
        method: 'PUT',
        credentials: 'include',
        body: JSON.stringify({
            isCurrent,
            linkId,
            amount,
            date,
            icon,
            title: titles,
            categoryId,
            tags,
            memo,
            updateAsset: false
        }),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(
            `Failed to create transaction.\n${data.message ? data.message : ''}`
        );
    }

    return response.json() as Promise<{ transaction: TransactionDataType }>;
};
