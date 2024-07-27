import axios from "axios";

// 애플 영수증 검증 URL
const APPLE_PRODUCTION_URL = "https://buy.itunes.apple.com/verifyReceipt";
const APPLE_SANDBOX_URL = "https://sandbox.itunes.apple.com/verifyReceipt";

// NOTE: https://developer.apple.com/documentation/appstorereceipts/responsebody/receipt/in_app
type AppleReceiptInfo = {
  quantity: string; // ex) "1";
  product_id: string; // ex) "bunny"
  transaction_id: string; // A unique identifier for a transaction such as a purchase, restore, or renewal.
  original_transaction_id: string; // ex) "2000000651969443";
  purchase_date: string; // ex) "2024-07-10 02:28:41 Etc/GMT";
  purchase_date_ms: string; // ex) "1720578521000";
  purchase_date_pst: string; // ex) "2024-07-09 19:28:41 America/Los_Angeles";
  original_purchase_date: string; // ex) "2024-07-10 02:28:41 Etc/GMT";
  original_purchase_date_ms: string; // ex) "1720578521000";
  original_purchase_date_pst: string; // ex)  "2024-07-09 19:28:41 America/Los_Angeles";
  is_trial_period: string; // ex) "false";
};

// NOTE: https://developer.apple.com/documentation/appstorereceipts/responsebody/receipt
type AppleReceipt = {
  receipt_type: string;
  adam_id: string;
  app_item_id: string;
  bundle_id: string;
  application_version: string;
  download_id: string;
  version_external_identifier: string;
  receipt_creation_date: string;
  receipt_creation_date_ms: string;
  receipt_creation_date_pst: string;
  request_date: string;
  request_date_ms: string;
  request_date_pst: string;
  original_purchase_date: string;
  original_purchase_date_ms: string;
  original_purchase_date_pst: string;
  original_application_version: string;
  in_app: Array<AppleReceiptInfo>;
};

export enum AppleVerifyReceiptResultStatus {
  Success = 0,
  Error000 = 21000, // The request to the App Store didn’t use the HTTP POST request method.
  Error001 = 21001, // The App Store no longer sends this status code.
  Error002 = 21002, // The data in the receipt-data property is malformed or the service experienced a temporary issue. Try again.
  Error003 = 21003, // The system couldn’t authenticate the receipt.
  Error004 = 21004, // The shared secret you provided doesn’t match the shared secret on file for your account.
  Error005 = 21005, // The receipt server was temporarily unable to provide the receipt. Try again.
  Error006 = 21006, // This receipt is valid, but the subscription is in an expired state. When your server receives this status code, the system also decodes and returns receipt data as part of the response. This status only returns for iOS 6-style transaction receipts for auto-renewable subscriptions.
  Error007 = 21007, // This receipt is from the test environment, but you sent it to the production environment for verification.
  Error008 = 21008, // This receipt is from the production environment, but you sent it to the test environment for verification.
  Error009 = 21009, // Internal data access error. Try again later.
  Error010 = 21010, // The system can’t find the user account or the user account has been deleted.
}

// NOTE: https://developer.apple.com/documentation/appstorereceipts/responsebody
type AppleVerifyReceiptResult = {
  receipt: AppleReceipt;
  environment: "Sendbox" | "Production";
  latest_receipt_info: Array<AppleReceiptInfo>;
  // latest_receipt
  status: AppleVerifyReceiptResultStatus;
};

class AppleReceiptVerifier {
  static async validate(
    receipt: string,
    isSendbox: boolean = true
  ): Promise<{
    status: AppleVerifyReceiptResultStatus;
    rawPaymentData: AppleReceiptInfo;
  }> {
    const url = isSendbox ? APPLE_SANDBOX_URL : APPLE_PRODUCTION_URL;

    try {
      const response = await axios.post(url, {
        "receipt-data": receipt,
        password: process.env.APPLE_SHARED_SECRET, // 앱의 공유 비밀 키
      });

      const responseData = response.data as AppleVerifyReceiptResult;

      return {
        status: responseData.status,
        rawPaymentData: responseData.latest_receipt_info[0],
      };
    } catch (error: any) {
      throw new Error(`[AppleReceiptVerifier.validate]: ${error.message}`);
    }
  }
}

export class IAPHelper {
  public static IOS = AppleReceiptVerifier;
}
