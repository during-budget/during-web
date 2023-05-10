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
  const response = await fetch(ASSET_URL, {
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
  const response = await fetch(CARD_URL, {
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
  const response = await fetch(PAYMENT_URL, {
    credentials: 'include',
  });

  if (!response.ok) {
    const data = await response.json();
    console.error(`Failed to get payment mehotds.\n${data.message ? data.message : ''}`);
    return null;
  }

  return response.json() as Promise<{ paymentMethods: PaymentDataType[] }>;
};

/** 자산 추가 */
export const createAsset = async (asset: Omit<AssetDataType, '_id'>) => {
  const response = await fetch(ASSET_URL, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(asset),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const data = await response.json();

    throw new Error(`Failed to create asset\n${data.message ? data.message : ''}`);
  }

  return response.json() as Promise<{
    assets: AssetDataType[];
    paymentMethods: PaymentDataType[];
  }>;
};

/** 자산 업데이트 */
export const updateAssets = async (assets: AssetDataType[]) => {
  const response = await fetch(ASSET_URL, {
    method: 'PUT',
    credentials: 'include',
    body: JSON.stringify({ assets }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const data = await response.json();

    throw new Error(`Failed to update assets.\n${data.message ? data.message : ''}`);
  }

  return response.json() as Promise<{
    assets: AssetDataType[];
    cards: CardDataType[];
    paymentMethods: PaymentDataType[];
  }>;
};

/** 자산 개별업데이트 */
export const updateAssetById = async (asset: AssetDataType) => {
  const url = `${ASSET_URL}/${asset._id}`;

  const response = await fetch(url, {
    method: 'PUT',
    credentials: 'include',
    body: JSON.stringify(asset),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const data = await response.json();

    throw new Error(
      `Failed to update asset: ${asset._id}\n${data.message ? data.message : ''}`
    );
  }

  return response.json() as Promise<{
    assets: AssetDataType[];
    cards: CardDataType[];
    paymentMethods: PaymentDataType[];
  }>;
};

/** 자산 삭제 */
export const removeAssetById = async (id: string) => {
  const url = `${ASSET_URL}/${id}`;

  const response = await fetch(url, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const data = await response.json();

    throw new Error(`Failed to remove asset: ${id}\n${data.message ? data.message : ''}`);
  }

  return response.json() as Promise<{
    assets: AssetDataType[];
    cards: CardDataType[];
    paymentMethods: PaymentDataType[];
  }>;
};

/** 카드 추가 */
export const createCard = async (card: Omit<CardDataType, '_id'>) => {
  const response = await fetch(CARD_URL, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(card),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const data = await response.json();

    throw new Error(`Failed to create card.\n${data.message ? data.message : ''}`);
  }

  return response.json() as Promise<{
    cards: CardDataType[];
    paymentMethods: PaymentDataType[];
  }>;
};

/** 카드 업데이트 */
export const updateCards = async (cards: CardDataType[]) => {
  const response = await fetch(CARD_URL, {
    method: 'PUT',
    credentials: 'include',
    body: JSON.stringify({ cards }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const data = await response.json();

    throw new Error(`Failed to update cards.\n${data.message ? data.message : ''}`);
  }

  return response.json() as Promise<{
    cards: CardDataType[];
    paymentMethods: PaymentDataType[];
  }>;
};

/** 카드 개별업데이트 */
export const updateCardById = async (card: Partial<CardDataType>) => {
  const url = `${CARD_URL}/${card._id}`;

  const response = await fetch(url, {
    method: 'PUT',
    credentials: 'include',
    body: JSON.stringify(card),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const data = await response.json();

    throw new Error(
      `Failed to update card: ${card._id}\n${data.message ? data.message : ''}`
    );
  }

  return response.json() as Promise<{
    assets?: AssetDataType[]; // 반환 X, 타입 에러를 위해 추가한 필드
    cards: CardDataType[];
    paymentMethods: PaymentDataType[];
  }>;
};

/** 카드 삭제 */
export const removeCardById = async (id: string) => {
  const url = `${CARD_URL}/${id}`;

  const response = await fetch(url, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const data = await response.json();

    throw new Error(`Failed to delete card: ${id}.\n${data.message ? data.message : ''}`);
  }

  return response.json() as Promise<{
    assets?: AssetDataType[]; // 반환 X, 타입 에러를 위해 추가한 필드
    cards: CardDataType[];
    paymentMethods: PaymentDataType[];
  }>;
};

/** 결제수단 업데이트 */
export const updatePayments = async (payments: PaymentDataType[]) => {
  const response = await fetch(PAYMENT_URL, {
    method: 'PUT',
    credentials: 'include',
    body: JSON.stringify({ paymentMethods: payments }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const data = await response.json();

    throw new Error(`Failed to update payments.\n${data.message ? data.message : ''}`);
  }

  return response.json() as Promise<{ paymentMethods: PaymentDataType[] }>;
};
