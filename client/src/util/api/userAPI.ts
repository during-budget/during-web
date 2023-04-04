const { DURING_SERVER } = import.meta.env;

const BASE_URL = `${DURING_SERVER}/api/users`;

export const sendCodeRegister = async (email: string) => {
    const url = `${BASE_URL}/register`;
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({ email }),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            `Failed to send code for register.\n${
                data.message ? data.message : ''
            }`
        );
    }

    return data;
};

export const verifyRegister = async (
    email: string,
    code: string,
    persist: boolean
) => {
    const url = `${BASE_URL}/register/verify`;
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({ email, code, persist }),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            `Failed to register.\n${data.message ? data.message : ''}`
        );
    }

    return data;
};

export const sendCodeLogin = async (email: string) => {
    const url = `${BASE_URL}/login/local`;
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({ email }),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            `Failed to send code for login.\n${
                data.message ? data.message : ''
            }`
        );
    }

    return data;
};

export const verifyLogin = async (
    email: string,
    code: string,
    persist: boolean
) => {
    const url = `${BASE_URL}/login/local/verify`;
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({ email, code, persist }),
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
