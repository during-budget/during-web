const { DURING_SERVER } = import.meta.env;

const BASE_URL = `${DURING_SERVER as string}/api`;

interface requestParams {
  url: string;
  body?: unknown;
  method: string;
  errorMessage?: string;
}

const getConfig = (method?: string, body?: unknown) => {
  return {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(body),
  } as RequestInit;
};

interface ResponseType {
  message?: string;
}

export const fetchRequest = async <T extends ResponseType>({
  url,
  body,
  method,
  errorMessage,
}: requestParams): Promise<T> => {
  if (!navigator.onLine) {
    throw new Error('NETWORK_NOT_AVAILABLE');
  }

  let response, data;

  try {
    response = await fetch(BASE_URL + url, getConfig(method, body));
    data = (await response.json()) as T | Error;

    if (data instanceof Error) {
      throw data;
    }

    if (!response.ok) {
      throw new Error(data?.message || errorMessage);
    }
  } catch (error) {
    throw error;
  }

  return data;
};
