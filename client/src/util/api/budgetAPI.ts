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
