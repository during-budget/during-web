const BASE_URL = 'http://localhost:5555';

export const getTestData = async () => {
    const url = `${BASE_URL}/api/test`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Response('Failed to fetch test data.', { status: 500 });
    }

    return response.json();
};
