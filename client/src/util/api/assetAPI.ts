const { DURING_SERVER } = import.meta.env;

const BASE_URL = `${DURING_SERVER}/api`;

export interface AssetDataType {
  _id: string;
  icon: string;
  title: string;
  amount: number;
  detail: 'account' | 'cash' | 'etc';
}

export interface CardDataType {
  _id: string;
  icon: string;
  title: string;
  detail: 'credit' | 'debit' | 'prepaid';
  linkedAssetId: string;
  linkedAssetIcon: string;
  linkedAssetTitle: string;
}

export interface PaymentDataType {
  _id: string;
  type: string;
  icon: string;
  title: string;
  detail: 'account' | 'cash' | 'etc' | 'credit' | 'debit' | 'prepaid';
}

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
