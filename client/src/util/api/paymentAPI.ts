const { DURING_SERVER } = import.meta.env;

const BASE_URL = `${DURING_SERVER}/api/payments`;

interface PaymentDataType {
  _id: string;
  merchant_uid: string;
  userId: string;
  itemId: string;
  itemType: string;
  itemTitle: string;
  amount: number;
  status: 'ready' | 'paid' | 'cancelled';
  rawPaymentData: any;
}

export const preparePayment = async (itemTitle: string) => {
  const url = `${BASE_URL}/prepare`;

  let response, data;

  try {
    response = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ itemTitle }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    data = await response.json();
  } catch (error) {
    throw error;
  }

  return data as { payment?: PaymentDataType; message?: string };
};

export const completePayment = async (info: {
  impUid: string | null;
  merchantUid: string;
}) => {
  const url = `${BASE_URL}/complete`;

  let response, data;

  try {
    response = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({
        imp_uid: info.impUid,
        merchant_uid: info.merchantUid,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    data = await response.json();
  } catch (error) {
    throw error;
  }

  return data as { payment?: PaymentDataType; message?: string };
};

export const completeMobilePayment = async (payload: any) => {
  const url = `${BASE_URL}/complete-by-mobile-user`;

  let response, data;

  try {
    response = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    data = await response.json();
  } catch (error) {
    throw error;
  }

  return data as { payment?: PaymentDataType; message?: string };
};
