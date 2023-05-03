const { DURING_SERVER } = import.meta.env;

const BASE_URL = `${DURING_SERVER}/api`;

export type AssetDetailType = 'account' | 'cash' | 'etc';
export type CardDetailType = 'debit' | 'credit' | 'prepaid';
export type DetailType = AssetDetailType | CardDetailType;

export interface AssetDataType {
  _id: string;
  icon: string;
  title: string;
  amount: number;
  detail: AssetDetailType;
}

export interface CardDataType {
  _id: string;
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
}

/** 자산 가져오기 */
export const getAssets = async () => {
  const url = `${BASE_URL}/assets`;
  const response = await fetch(url, {
    credentials: 'include',
  });

  if (!response.ok) {
    const data = await response.json();
    console.error(`Failed to get assets.\n${data.message ? data.message : ''}`);
    return null;
  }

  return response.json() as Promise<{ assets: AssetDataType[] }>;
};

/** 카드 가져오기 */
export const getCards = async () => {
  const url = `${BASE_URL}/cards`;
  const response = await fetch(url, {
    credentials: 'include',
  });

  if (!response.ok) {
    const data = await response.json();
    console.error(`Failed to get cards.\n${data.message ? data.message : ''}`);
    return null;
  }

  return response.json() as Promise<{ cards: CardDataType[] }>;
};

/** 결제수단(자산 + 카드) 가져오기 */
export const getpaymentMethods = async () => {
  const url = `${BASE_URL}/paymentMethods`;
  const response = await fetch(url, {
    credentials: 'include',
  });

  if (!response.ok) {
    const data = await response.json();
    console.error(`Failed to get payment mehotds.\n${data.message ? data.message : ''}`);
    return null;
  }

  return response.json() as Promise<{ paymentMethods: PaymentDataType[] }>;
};

/** 자산 업데이트 */
export const updateAssets = async ({ assets }: { assets: Partial<AssetDataType>[] }) => {
  const url = `${BASE_URL}/assets`;

  const response = await fetch(url, {
    method: 'PUT',
    credentials: 'include',
    body: JSON.stringify({ assets }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const data = await response.json();

    throw new Error(`Failed to update categories.\n${data.message ? data.message : ''}`);
  }

  return response.json() as Promise<{ assets: AssetDataType[] }>;
};

/** 카드 업데이트 */
export const updateCards = async ({ cards }: { cards: Partial<CardDataType>[] }) => {
  const url = `${BASE_URL}/cards`;

  const response = await fetch(url, {
    method: 'PUT',
    credentials: 'include',
    body: JSON.stringify({ cards }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const data = await response.json();

    throw new Error(`Failed to update categories.\n${data.message ? data.message : ''}`);
  }

  return response.json() as Promise<{ cards: CardDataType[] }>;
};
