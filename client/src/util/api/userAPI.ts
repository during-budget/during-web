import { AssetDataType, CardDataType, PaymentDataType } from './assetAPI';
import { UserCategoryType } from './categoryAPI';
import { SettingType } from './settingAPI';

const { DURING_SERVER } = import.meta.env;

const BASE_URL = `${DURING_SERVER}/api/users`;

export interface UserDataType {
  _id: string;
  userName: string;
  categories: UserCategoryType[];
  createdAt: string;
  updatedAt: string;
  email: string;
  isGuest: boolean;
  basicBudgetId: string;
  assets: AssetDataType[];
  cards: CardDataType[];
  paymentMethods: PaymentDataType[];
  settings: SettingType;
}

export const sendCodeRegister = async (email: string) => {
  const url = `${BASE_URL}/register`;

  let response, data;

  try {
    response = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ email }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    data = await response.json();
  } catch (error) {
    throw new Error('회원가입 코드 요청 중 문제가 발생했습니다.', {
      cause: { error },
    });
  }

  if (!response) {
    throw new Error(`회원가입 코드 요청 결과를 알 수 없습니다.`, {
      cause: { response },
    });
  }

  if (!response.ok) {
    if (response.status === 409) {
      throw new Error('이미 사용중인 이메일입니다.');
    } else {
      throw new Error('회원가입 코드 전송 중 문제가 발생했습니다', {
        cause: { status: response.status, message: data.message },
      });
    }
  }

  return data as { message: string };
};

export const verifyRegister = async (email: string, code: string, persist: boolean) => {
  const url = `${BASE_URL}/register/verify`;

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
    throw new Error('회원가입 인증 요청 중 문제가 발생했습니다.', {
      cause: { error },
    });
  }

  if (!response) {
    throw new Error(`회원가입 인증 요청 결과를 알 수 없습니다.`, {
      cause: { response },
    });
  }

  if (!response.ok) {
    // throw new Error(`Failed to register.\n${data.message ? data.message : ''}`);
    if (response.status === 400) {
      throw new Error('잘못된 회원가입 인증 요청입니다.');
    } else if (response.status === 409) {
      throw new Error('잘못된 인증코드입니다. 코드를 다시 입력해주세요.');
    } else {
      throw new Error('회원가입 인증 중 문제가 발생했습니다', {
        cause: { status: response.status, message: data.message },
      });
    }
  }

  return data as { user: UserDataType };
};

export const sendCodeLogin = async (email: string) => {
  const url = `${BASE_URL}/login/local`;

  let response, data;

  try {
    response = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ email }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    data = await response.json();
  } catch (error) {
    throw new Error('로그인 코드 요청 중 문제가 발생했습니다.', {
      cause: { error },
    });
  }

  if (!response) {
    throw new Error(`로그인 코드 요청 결과를 알 수 없습니다.`, {
      cause: { response },
    });
  }

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('가입되지 않은 이메일입니다');
    } else {
      throw new Error('로그인 코드 전송 중 문제가 발생했습니다', {
        cause: { status: response.status, message: data.message },
      });
    }
  }

  return data as { message: string };
};

export const verifyLogin = async (email: string, code: string, persist: boolean) => {
  const url = `${BASE_URL}/login/local/verify`;

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
    console.error(error);
    throw new Error('로그인 인증 요청 중 문제가 발생했습니다.', { cause: error });
  }

  if (!response) {
    const error = new Error('로그인 인증 요청 결과를 알 수 없습니다.', {
      cause: { response },
    });
    console.error(error);
    throw error;
  }

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('유효 시간이 지났습니다. 코드를 다시 전송해주세요.');
    } else if (response.status === 409) {
      throw new Error('잘못된 인증코드입니다. 코드를 다시 입력해주세요.');
    } else if (response.status === 400) {
      throw new Error('잘못된 요청입니다.', {
        cause: { status: response.status, message: data.message },
      });
    } else {
      throw new Error(
        `로그인 인증 중 문제가 발생했습니다\n${data.message ? data.message : ''}`,
        {
          cause: { response, message: data.message },
        }
      );
    }
  }

  return data as { user: UserDataType };
};

export const logoutUser = async () => {
  const url = `${BASE_URL}/logout`;
  const response = await fetch(url, {
    credentials: 'include',
  });

  if (!response.ok) {
    const data = await response.json();
    console.error(`Failed logout.\n${data.message ? data.message : ''}`);
    return null;
  }

  return response.json();
};

export const deleteUser = async () => {
  const url = `${BASE_URL}`;
  const response = await fetch(url, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) {
    const data = await response.json();
    console.error(`Failed delete user.\n${data.message ? data.message : ''}`);
    return null;
  }

  return;
};

export const getUserState = async () => {
  const url = `${BASE_URL}/current`;
  const response = await fetch(url, {
    credentials: 'include',
  });

  if (!response.ok) {
    const data = await response.json();
    console.error(`Yout should login.\n${data.message ? data.message : ''}`);
    return null;
  }

  return response.json() as Promise<{ user: UserDataType }>;
};
