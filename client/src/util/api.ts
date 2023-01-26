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
