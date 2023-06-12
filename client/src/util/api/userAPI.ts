import { UserInfoType } from '../../store/user';
import { checkNetwork } from '../network';
import { AssetDataType, CardDataType, PaymentDataType } from './assetAPI';
import { AuthDataType } from './authAPI';
import { UserCategoryType } from './categoryAPI';
import { SettingDataType } from './settingAPI';

const { DURING_SERVER } = import.meta.env;

const BASE_URL = `${DURING_SERVER}/api/users`;

export interface UserDataType extends AuthDataType {
  _id: string;
  userName: string;
  categories: UserCategoryType[];
  createdAt: string;
  updatedAt: string;
  tel: string;
  birthdate: string;
  gender: string;
  basicBudgetId: string;
  assets: AssetDataType[];
  cards: CardDataType[];
  paymentMethods: PaymentDataType[];
  settings: SettingDataType;
}

export const updateUserInfo = async (info: Partial<UserInfoType>) => {
  checkNetwork();

  let response, data;
  try {
    response = await fetch(BASE_URL, {
      method: 'PUT',
      credentials: 'include',
      body: JSON.stringify(info),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    data = await response.json();
  } catch (error) {
    throw error;
  }

  if (!response.ok) {
    throw new Error(data?.message || '회원 정보 업데이트 처리 중 문제가 발생했습니다.');
  }

  return data as {
    message?: string;
  } & Partial<UserInfoType>;
};

export const deleteUser = async () => {
  const url = `${BASE_URL}`;

  let response, data;

  try {
    response = await fetch(url, {
      method: 'DELETE',
      credentials: 'include',
    });

    data = await response.json();
  } catch (error) {
    throw error;
  }

  if (!response.ok) {
    throw new Error(data?.message || '회원 탈퇴 시도 중 문제가 발생했습니다');
  }

  return;
};

export const getUserState = async () => {
  const url = `${BASE_URL}/current`;
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
    const message = data?.message;
    if (message === 'NOT_LOGGED_IN') {
      return null;
    } else {
      throw new Error(message || '로그인 정보를 불러오는 중 문제가 발생했습니다.');
    }
  }

  return data as { user?: UserDataType };
};
