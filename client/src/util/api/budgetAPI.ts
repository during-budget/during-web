const BASE_URL = 'http://localhost:5555/api/budgets';

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

    return response.json();
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

    return response.json();
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

    return response.json();
};

export const updateCategoryPlan = async (
    budgetId: string,
    categoryId: string,
    amount: number
) => {
    const url = `${BASE_URL}/${budgetId}/category/amountPlanned?categoryId=${categoryId}`;
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

    return response.json();
};

export const updateCategories = async (
    budgetId: string,
    categories: { categoryId: string; amountPlanned: number }[]
) => {
    const url = `${BASE_URL}/${budgetId}/categories`;
    const response = await fetch(url, {
        method: 'PUT',
        credentials: 'include',
        body: JSON.stringify({ categories }),
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

    return response.json();
};
