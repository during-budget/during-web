const BASE_URL = 'http://localhost:5555/api/users';

export const registerUser = async (userName: string, password: string) => {
    const url = `${BASE_URL}/register`;
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

export const loginUser = async (email: string, password: string) => {
    const url = `${BASE_URL}/login/local`;
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({
            email,
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

    return data;
};

export const getUserState = async () => {
    const url = `${BASE_URL}/current`;
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
