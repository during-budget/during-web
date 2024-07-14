import { Platform } from "@models/payment.model";
import {
  InAppProductNotFoundError,
  InAppProductPurchaseNotFoundError,
} from "src/errors/NotFoundError";
import { GoogleAndroidPublisher, InAppProduct } from "src/lib/googleAPIs";
import { RawPaymentDataByPlatform } from "src/types/payment.type";

export class GoogleInAppHelper {
  client: GoogleAndroidPublisher;

  constructor() {
    this.client = new GoogleAndroidPublisher();
  }

  async getInAppProducts(): Promise<{
    inAppProducts: Array<InAppProduct>;
  }> {
    const { inappproduct } = await this.client.getInAppProducts();

    return { inAppProducts: inappproduct };
  }

  async isInAppProductActive(sku: string): Promise<boolean> {
    const inAppProduct = await this.client.getInAppProduct(sku);

    if (!inAppProduct) {
      throw new InAppProductNotFoundError();
    }

    return inAppProduct.status === "active";
  }

  async findInAppProductPurchase(
    sku: string,
    token: string
  ): Promise<RawPaymentDataByPlatform<Platform.Android>> {
    try {
      const inAppProduct = await this.client.getInAppProduct(sku);

      if (!inAppProduct) {
        throw new InAppProductNotFoundError();
      }

      const purchase = await this.client.getInAppProductPurchase(sku, token);

      if (!purchase) {
        throw new InAppProductPurchaseNotFoundError();
      }

      return purchase;
    } catch (err: any) {
      throw new Error(
        `Unexpected Error; Failed to get in-app product purchase (rawError: ${JSON.stringify(
          err?.response?.data?.error ?? {}
        )})`
      );
    }
  }
}
