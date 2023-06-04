const { DURING_SERVER } = import.meta.env;

const BASE_URL = `${DURING_SERVER}/api/items`;

interface ItemDataType {
  _id: string;
  type: string;
  title: string;
  price: number;
}

export const getItemsByType = async (type: string) => {
  const url = `${BASE_URL}/items?type=${type}`;

  let response, data;
  try {
    response = await fetch(url, {
      credentials: 'include',
    });
    data = await response.json();
  } catch (error) {
    throw error;
  }

  return data as { items: ItemDataType[] };
};
