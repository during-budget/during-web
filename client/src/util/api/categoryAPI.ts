const { DURING_SERVER } = import.meta.env;
import { validate as isUUID } from 'uuid';
import Category from '../../models/Category';

const BASE_URL = `${DURING_SERVER}/api/categories`;

export const getCategories = async () => {
    const response = await fetch(BASE_URL, {
        credentials: 'include',
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Response(
            `Failed to get categories.\n${data.message ? data.message : ''}`,
            { status: response.status }
        );
    }

    return response.json();
};

export const updateCategories = async (categoryData: Category[]) => {
    const categories = categoryData.map((category) => {
        const { id, isExpense, icon, title } = category;

        return {
            _id: isUUID(id) ? undefined : id,
            isExpense,
            isIncome: !isExpense,
            icon,
            title,
        };
    });

    const response = await fetch(BASE_URL, {
        method: 'PUT',
        credentials: 'include',
        body: JSON.stringify({ categories }),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            `Failed to update categories.\n${data.message ? data.message : ''}`
        );
    }

    return data;
};
