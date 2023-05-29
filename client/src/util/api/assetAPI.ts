import { checkNetwork } from '../network';

const { DURING_SERVER } = import.meta.env;

const ASSET_URL = `${DURING_SERVER}/api/assets`;
const CARD_URL = `${DURING_SERVER}/api/cards`;
const PAYMENT_URL = `${DURING_SERVER}/api/paymentMethods`;

export type AssetDetailType = 'account' | 'cash' | 'etc';
export type CardDetailType = 'debit' | 'credit' | 'prepaid';
export type DetailType = AssetDetailType | CardDetailType;

export interface AssetDataType {
  _id: string;
  id?: string;
  icon: string;
  title: string;
  amount: number;
  detail: AssetDetailType;
}

export interface CardDataType {
  _id: string;
  id?: string;
  icon: string;
  title: string;
  detail: CardDetailType;
  linkedAssetId: string;
  linkedAssetIcon: string;
  linkedAssetTitle: string;
}

export interface PaymentDataType {
  _id: string;
  type: string;
  icon: string;
  title: string;
  detail: DetailType;
  isChecked: boolean;
}

/** 자산 가져오기 */
export const getAssets = async () => {
  checkNetwork();

  let response, data;
  try {
    response = await fetch(ASSET_URL, {
      credentials: 'include',
    });
    data = await response.json();
  } catch (error) {
    throw error;
  }

  if (!response.ok) {
    throw new Error(data?.message || '자산 데이터를 불러오는 중 문제가 발생했습니다.');
  }

  return data as { assets: AssetDataType[] };
};

/** 카드 가져오기 */
export const getCards = async () => {
  checkNetwork();

  let response, data;
  try {
    response = await fetch(CARD_URL, {
      credentials: 'include',
    });
    data = await response.json();
  } catch (error) {
    throw error;
  }

  if (!response.ok) {
    throw new Error(data?.message || '카드 데이터를 불러오는 중 문제가 발생했습니다.');
  }

  return data as { cards: CardDataType[] };
};

/** 결제수단(자산 + 카드) 가져오기 */
export const getPaymentMethods = async () => {
  checkNetwork();

  let response, data;

  try {
    response = await fetch(PAYMENT_URL, {
      credentials: 'include',
    });
    data = await response.json();
  } catch (error) {
    throw error;
  }

  if (!response.ok) {
    throw new Error(
      data?.message || '결제수단 데이터를 불러오는 중 문제가 발생했습니다.'
    );
  }

  return data as { paymentMethods: PaymentDataType[] };
};

/** 자산 추가 */
export const createAsset = async (asset: Omit<AssetDataType, '_id'>) => {
  checkNetwork();

  let response, data;
  try {
    response = await fetch(ASSET_URL, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(asset),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    data = await response.json();
  } catch (error) {
    throw error;
  }

  if (!response.ok) {
    throw new Error(data?.message || '자산 추가 처리 중 문제가 발생했습니다.');
  }

  return data as {
    assets: AssetDataType[];
    paymentMethods: PaymentDataType[];
  };
};

/** 자산 업데이트 */
export const updateAssets = async (assets: AssetDataType[]) => {
  checkNetwork();

  let response, data;
  try {
    response = await fetch(ASSET_URL, {
      method: 'PUT',
      credentials: 'include',
      body: JSON.stringify({ assets }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    data = await response.json();
  } catch (error) {
    throw error;
  }

  if (!response.ok) {
    throw new Error(data?.message || '자산 업데이트 처리 중 문제가 발생했습니다.');
  }

  return data as {
    assets: AssetDataType[];
    cards: CardDataType[];
    paymentMethods: PaymentDataType[];
  };
};

/** 자산 개별업데이트 */
export const updateAssetById = async (asset: AssetDataType) => {
  checkNetwork();
  const url = `${ASSET_URL}/${asset._id}`;

  let response, data;
  try {
    response = await fetch(url, {
      method: 'PUT',
      credentials: 'include',
      body: JSON.stringify(asset),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    data = await response.json();
  } catch (error) {
    throw error;
  }

  if (!response.ok) {
    throw new Error(data?.message || '자산 개별 업데이트 중 문제가 발생했습니다.');
  }

  return data as {
    assets: AssetDataType[];
    cards: CardDataType[];
    paymentMethods: PaymentDataType[];
  };
};

/** 자산 삭제 */
export const removeAssetById = async (id: string) => {
  checkNetwork();

  const url = `${ASSET_URL}/${id}`;

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
    throw new Error(data?.message || '자산 삭제 처리 중 문제가 발생했습니다.');
  }

  return data as {
    assets: AssetDataType[];
    cards: CardDataType[];
    paymentMethods: PaymentDataType[];
  };
};

/** 카드 추가 */
export const createCard = async (card: Omit<CardDataType, '_id'>) => {
  checkNetwork();

  let response, data;
  try {
    response = await fetch(CARD_URL, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(card),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    data = await response.json();
  } catch (error) {
    throw error;
  }

  if (!response.ok) {
    throw new Error(data?.message || '카드 추가 처리 중 문제가 발생했습니다.');
  }

  return data as {
    cards: CardDataType[];
    paymentMethods: PaymentDataType[];
  };
};

/** 카드 업데이트 */
export const updateCards = async (cards: CardDataType[]) => {
  checkNetwork();

  let response, data;
  try {
    response = await fetch(CARD_URL, {
      method: 'PUT',
      credentials: 'include',
      body: JSON.stringify({ cards }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    data = await response.json();
  } catch (error) {
    throw error;
  }

  if (!response.ok) {
    throw new Error(data?.message || '카드 업데이트 중 문제가 발생했습니다.');
  }

  return data as {
    cards: CardDataType[];
    paymentMethods: PaymentDataType[];
  };
};

/** 카드 개별업데이트 */
export const updateCardById = async (card: Partial<CardDataType>) => {
  checkNetwork();

  const url = `${CARD_URL}/${card._id}`;

  let response, data;
  try {
    response = await fetch(url, {
      method: 'PUT',
      credentials: 'include',
      body: JSON.stringify(card),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    data = await response.json();
  } catch (error) {
    throw error;
  }

  if (!response.ok) {
    throw new Error(data?.message || '카드 개별 업데이트 중 문제가 발생했습니다.');
  }

  return data as {
    assets?: AssetDataType[]; // 반환 X, 타입 에러를 위해 추가한 필드
    cards: CardDataType[];
    paymentMethods: PaymentDataType[];
  };
};

/** 카드 삭제 */
export const removeCardById = async (id: string) => {
  checkNetwork();

  const url = `${CARD_URL}/${id}`;

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
    throw new Error(data?.message || '카드 삭제 처리 중 문제가 발생했습니다.');
  }

  return data as {
    assets?: AssetDataType[]; // 반환 X, 타입 에러를 위해 추가한 필드
    cards: CardDataType[];
    paymentMethods: PaymentDataType[];
  };
};

/** 결제수단 업데이트 */
export const updatePayments = async (payments: PaymentDataType[]) => {
  checkNetwork();

  let response, data;
  try {
    response = await fetch(PAYMENT_URL, {
      method: 'PUT',
      credentials: 'include',
      body: JSON.stringify({ paymentMethods: payments }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    data = await response.json();
  } catch (error) {
    throw error;
  }

  if (!response.ok) {
    throw new Error(data?.message || '결제수단 업데이트 중 문제가 발생했습니다.');
  }

  return data as { paymentMethods: PaymentDataType[] };
};
