export enum InAppPlatform {
  Android = "android",
  IOS = "ios",
}

export type CompletePaymentByAndroidReq = {
  platform: InAppPlatform.Android;
  payload: AndroidPayload;
};

export type AndroidPayload = {
  title: string; // TODO: rename productId
  token: string; // TODO: rename purchaseToken
};

export type IOSPayload = {
  // transactionDate: Date;
  // transactionId: string;
  productId: string;
  transactionReceipt: string;
};

export function validateIOSPayload(
  payload: Record<string, any>
): payload is IOSPayload {
  if (!("productId" in payload) || typeof payload.productId !== "string")
    return false;
  if (
    !("transactionReceipt" in payload) ||
    typeof payload.transactionReceipt !== "string"
  )
    return false;

  return true;
}

export type CompletePaymentByIOSReq = {
  platform: InAppPlatform.IOS;
  payload: IOSPayload;
};

export type CompletePaymentByMobileUserReq =
  | CompletePaymentByAndroidReq
  | CompletePaymentByIOSReq;
