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
