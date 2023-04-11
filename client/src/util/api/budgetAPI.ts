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
    expensePlanned: number;
    incomeCurrent: number;
    incomeScheduled: number;
    incomePlanned: number;
    categories: BudgetCategoryType[];
}

export const getBudgetList = async () => {
    const url = BASE_URL;
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

    return response.json() as Promise<{ budgets: BudgetDataType[] }>;
};

export const getBudgetById = async (id: string) => {
    const url = `${BASE_URL}/${encodeURIComponent(id)}`;
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

    // TODO: transactionsDataType 정의
    return response.json() as Promise<{
        budget: BudgetDataType;
        transactions: TransactionDataType[];
    }>;
};

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
            `Failed to patch budget fields.\n${
                data.message ? data.message : ''
            }`,
            { status: response.status }
        );
    }

    return response.json() as Promise<{ budget: BudgetDataType }>;
};

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
            `Failed to patch category plan.\n${
                data.message ? data.message : ''
            }`,
            { status: response.status }
        );
    }

    return response.json() as Promise<{ budget: BudgetDataType }>;
};

export const updateBudgetCategories = async (
    budgetId: string,
    isExpense: boolean,
    categories: {
        categoryId: string;
        amountPlanned: number;
    }[]
) => {
    const body: { isExpense?: boolean; isIncome?: boolean; categories: any } = {
        categories,
    };

    // NOTE: isExpense=true or isIncom=true
    body.isExpense = isExpense;
    body.isIncome = !isExpense;

    const url = `${BASE_URL}/${budgetId}/categories`;
    const response = await fetch(url, {
        method: 'PUT',
        credentials: 'include',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Response(
            `Failed to patch category plan.\n${
                data.message ? data.message : ''
            }`,
            { status: response.status }
        );
    }

    return response.json() as Promise<UpdatedBudgetCategoryType>;
};
