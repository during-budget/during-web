import Category from '../models/Category';
import Transaction from '../models/Transaction';

const BASE_URL = 'http://localhost:5555';

export const getTestData = async () => {
    const url = `${BASE_URL}/api/test`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Response('Failed to fetch test data.', { status: 500 });
    }

    return response.json();
};

export const register = async (userName: string, password: string) => {
    const url = `${BASE_URL}/api/users/register`;
    const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
            userName,
            password,
        }),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(`Failed to register.\n${data ? data.message : ''}`);
    }
};

export const login = async (userName: string, password: string) => {
    const url = `${BASE_URL}/api/users/login/local`;
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({
            userName,
            password,
        }),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            `Failed to login.\n${data.message ? data.message : ''}`
        );
    }
};

export const getCurrentUserState = async () => {
    const url = `${BASE_URL}/api/users/current`;
    const response = await fetch(url, {
        credentials: 'include',
    });

    if (!response.ok) {
        const data = await response.json();
        console.error(
            `Yout should login.\n${data.message ? data.message : ''}`
        );
        return null;
    }

    return response.json();
};

export const getBudgetList = async () => {
    const url = `${BASE_URL}/api/budgets`;
    const response = await fetch(url, {
        credentials: 'include',
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Response(
            `Failed to get budgets.\n${data.message ? data.message : ''}`,
            { status: response.status }
        );
    }

    return response.json();
};

export const getBudgetById = async (id: string) => {
    const url = `${BASE_URL}/api/budgets/${encodeURIComponent(id)}`;
    const response = await fetch(url, {
        credentials: 'include',
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Response(
            `Failed to get budgets.\n${data.message ? data.message : ''}`,
            { status: response.status }
        );
    }

    return response.json();
};

export const createBudget = async (budget: any) => {
    const url = `${BASE_URL}/api/budgets`;

    const categories = budget.categories.map((category: Category) => {
        return {
            categoryId: category.id,
            amountPlanned: category.amount!.planned,
        };
    });
    budget.categories = categories;

    const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(budget),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            `Failed to create budget.\n${data.message ? data.message : ''}`
        );
    }

    return data.budget._id;
};

export const createTransaction = async (transaction: Transaction) => {
    const url = `${BASE_URL}/api/transactions`;

    const {
        budgetId,
        linkId,
        date,
        isExpense,
        isIncome,
        isCurrent,
        title,
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
            isIncome,
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

export const getTransaction = async (budgetId: string) => {
    const url = `${BASE_URL}/api/transactions?budgetId=${encodeURIComponent(
        budgetId
    )}`;
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

export const updateTransactionFields = async (transaction: Transaction) => {
    const url = `${BASE_URL}/api/transactions/${transaction.id}`;

    const { date, title, linkId, tags, memo } = transaction;

    const response = await fetch(url, {
        method: 'PATCH',
        credentials: 'include',
        body: JSON.stringify({
            date,
            linkId,
            title,
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
    const url = `${BASE_URL}/api/transactions/${transaction.id}/amount`;

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
    const url = `${BASE_URL}/api/transactions/${transaction.id}/category`;

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

export const deleteTransaction = async (transactionId: string) => {
    const url = `${BASE_URL}/api/transactions/${encodeURIComponent(
        transactionId
    )}`;
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
