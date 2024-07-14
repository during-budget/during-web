import { Platform } from "@models/payment.model";
import axios from "axios";
import { google } from "googleapis";
import config from "src/config";
import {
  AndroidRawPaymentData,
  RawPaymentDataByPlatform,
} from "src/types/payment.type";

// references:
// https://medium.com/@su_bak/google-play-android-developer-api-%EC%82%AC%EC%9A%A9-%EB%B0%A9%EB%B2%95-d39ca46ff9ca
// https://velog.io/@badpenguin/AndroidDeveloperAPIConfiguration
// https://stackoverflow.com/questions/43536904/google-play-developer-api-the-current-user-has-insufficient-permissions-to-pe

const GooglePackageName = "com.during";

enum GoogleApiScope {
  ANDROID_PUBLISHER = "https://www.googleapis.com/auth/androidpublisher",
}

type InAppProductPrice = { priceMicros: string; currency: string };

type GetInAppProductsResponse = {
  kind: string;
  inappproduct: Array<InAppProduct>;
  tokenPagination: object;
};

type GetInAppProductResponse = InAppProduct;

type GetInAppProductPurchaseResponse =
  RawPaymentDataByPlatform<Platform.Android>;

// reference: https://developers.google.com/android-publisher/api-ref/rest/v3/inappproducts?hl=ko#InAppProductListing
export type InAppProduct = {
  packageName: string;
  sku: string;
  status: "statusUnspecified" | "active" | "inactive";
  purchaseType: "purchaseTypeUnspecified" | "managedUser" | "subscription";
  defaultPrice: InAppProductPrice;
  prices: { [key: string]: InAppProductPrice };
  listings: {
    [key: string]: Array<{
      title: string;
      description: string;
      benefits: Array<string>;
    }>;
  };
  defaultLanguage: string;
  subscriptionPeriod: string;
  trialPeriod: string;
  gracePeriod: string;
} & (
  | { subscriptionTaxesAndComplianceSettings: object }
  | { managedProductTaxesAndComplianceSettings: object }
);

export type InAppProductPurchase = AndroidRawPaymentData;

export class GoogleAndroidPublisher {
  constructor(
    private authClient = new google.auth.GoogleAuth({
      credentials: config.GOOGLE_CREDENTIALS,
      scopes: GoogleApiScope.ANDROID_PUBLISHER,
    })
  ) {}

  private getAccessToken = async (): Promise<string> => {
    const accessToken = await this.authClient.getAccessToken();
    if (typeof accessToken !== "string") {
      throw new Error("Failed to fetch accessToken");
    }

    return accessToken;
  };

  private request = async <T extends object>(req: {
    method: "GET";
    url: string;
  }): Promise<T> => {
    const { method, url } = req;
    const accessToken = await this.getAccessToken();

    try {
      const { data: res } = await axios({
        method,
        url,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      return res;
    } catch (err: any) {
      console.log("Request Failed: ", err);

      throw err;
    }
  };

  getInAppProducts = async (): Promise<GetInAppProductsResponse> => {
    return this.request<GetInAppProductsResponse>({
      method: "GET",
      url: `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${GooglePackageName}/inappproducts`,
    });
  };

  getInAppProduct = async (sku: string): Promise<GetInAppProductResponse> => {
    return this.request<GetInAppProductResponse>({
      method: "GET",
      url: `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${GooglePackageName}/inappproducts/${sku}`,
    });
  };

  getInAppProductPurchase = async (sku: string, token: string) => {
    return this.request<GetInAppProductPurchaseResponse>({
      method: "GET",
      url: `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${GooglePackageName}/purchases/products/${sku}/tokens/${token}`,
    });
  };
}
