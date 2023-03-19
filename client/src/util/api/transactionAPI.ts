import Transaction from '../../models/Transaction';

const BASE_URL = 'http://localhost:5555/api/transactions';

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

    return response.json();
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
        }),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const data = await response.json();

    if (!response.ok) {
        console.log('create transaction fail');
        throw new Error(
            `Failed to create transaction.\n${data.message ? data.message : ''}`
        );
    }
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

export const updateTransactionFields = async (transaction: Transaction) => {
    const url = `${BASE_URL}/${transaction.id}`;

    const { date, titles, linkId, tags, memo } = transaction;

    const response = await fetch(url, {
        method: 'PATCH',
        credentials: 'include',
        body: JSON.stringify({
            date,
            linkId,
            title: titles,
            tags,
            memo,
        }),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const data = await response.json();

    if (!response.ok) {
        console.log('create transaction fail');
        throw new Error(
            `Failed to create transaction.\n${data.message ? data.message : ''}`
        );
    }
};

export const updateTransactionAmount = async (transaction: Transaction) => {
    const url = `${BASE_URL}/${transaction.id}/amount`;

    const response = await fetch(url, {
        method: 'PUT',
        credentials: 'include',
        body: JSON.stringify({
            amount: transaction.amount,
        }),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const data = await response.json();

    if (!response.ok) {
        console.log('create transaction fail');
        throw new Error(
            `Failed to create transaction.\n${data.message ? data.message : ''}`
        );
    }
};

export const updateTransactionCategory = async (transaction: Transaction) => {
    const url = `${BASE_URL}/${transaction.id}/category`;

    const response = await fetch(url, {
        method: 'PUT',
        credentials: 'include',
        body: JSON.stringify({
            categoryId: transaction.categoryId,
        }),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const data = await response.json();

    if (!response.ok) {
        console.log('create transaction fail');
        throw new Error(
            `Failed to create transaction.\n${data.message ? data.message : ''}`
        );
    }
};
