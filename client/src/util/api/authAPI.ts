import { checkNetwork } from '../network';
import { UserDataType } from './userAPI';

const { DURING_SERVER } = import.meta.env;

const BASE_URL = `${DURING_SERVER}/api/auth`;

export const providers: { provider: string; label: string; icon: string }[] = [
  { provider: 'google', label: '구글', icon: 'G' },
  { provider: 'naver', label: '네이버', icon: 'N' },
  { provider: 'kakao', label: '카카오', icon: 'K' },
];

export const getAuthURL = (provider: string) => BASE_URL + '/' + provider;

export interface SnsIdType {
  [key: string]: string | undefined;
}

export const defaultSnsId = {
  google: undefined,
  naver: undefined,
  kakao: undefined,
};

export interface AuthDataType {
  email: string;
  isLocal: boolean;
  snsId: {
    google?: string;
    naver?: string;
    kakao?: string;
  };
  isGuest: false;
}

export const getAuthState = async () => {
  checkNetwork();

  const url = `${BASE_URL}`;
  let response, data;
  try {
    response = await fetch(url, {
      credentials: 'include',
    });
    data = await response.json();
  } catch (error) {
    throw error;
  }

  if (!response.ok) {
    throw new Error(data?.message);
  }

  return data as { user: AuthDataType };
};

export const localAuth = async (email: string, code?: string, persist?: boolean) => {
  checkNetwork();

  const url = `${BASE_URL}/local`;

  let response, data;

  try {
    response = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ email, code, persist }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    data = await response.json();
  } catch (error) {
    throw error;
  }

  if (!response.ok) {
    throw new Error(data?.ERROR_MESSAGE);
  }

  return data as { message: string; user: UserDataType };
};

export const logoutUser = async () => {
  checkNetwork();

  const url = `${BASE_URL}/logout`;

  let response, data;
  try {
    response = await fetch(url, {
      credentials: 'include',
    });
    data = await response.json();
  } catch (error) {
    throw error;
  }

  if (!response.ok) {
    throw new Error(data?.message);
  }

  return data;
};

export const disconnectSnsId = async (provider: string) => {
  checkNetwork();

  const url = `${BASE_URL}/${provider}`;

  let response, data;

  try {
    response = await fetch(url, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    data = await response.json();
  } catch (error) {
    throw error;
  }

  if (!response.ok) {
    throw data?.message;
  }

  return data as { snsId: SnsIdType };
};

export const getSnsId = async () => {
  checkNetwork();

  const url = `${BASE_URL}`;

  let response, data;

  try {
    response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    data = await response.json();
  } catch (error) {
    throw error;
  }

  if (!response.ok) {
    throw data?.message;
  }

  return data as { snsId: SnsIdType };
};

export const guestLogin = async () => {
  checkNetwork();

  const url = `${BASE_URL}/guest`;

  let response, data;
  try {
    response = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ persist: true }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    data = await response.json();
  } catch (error) {
    throw error;
  }

  if (!response.ok) {
    throw new Error(data?.message);
  }

  return data;
};
