import {
  InAppProductNotFoundError,
  InAppProductPurchaseNotFoundError,
} from "src/errors/NotFoundError";
import {
  GoogleAndroidPublisher,
  InAppProduct,
  InAppProductPurchase,
  InAppProductPurchaseState,
} from "src/lib/googleAPIs";

export const getInAppProducts = async (): Promise<{
  inAppProducts: Array<InAppProduct>;
}> => {
  const client = new GoogleAndroidPublisher();

  const { inappproduct } = await client.getInAppProducts();

  return { inAppProducts: inappproduct };
};

export const findInAppProductBySku = async (
  sku: string
): Promise<InAppProduct> => {
  const client = new GoogleAndroidPublisher();

  return client.getInAppProduct(sku);
};

export const isInAppProductActive = async (sku: string): Promise<boolean> => {
  const inAppProduct = await findInAppProductBySku(sku);

  if (!inAppProduct) {
    throw new InAppProductNotFoundError();
  }

  return inAppProduct.status === "active";
};

export const findInAppProductPurchase = async (
  sku: string,
  token: string
): Promise<InAppProductPurchase> => {
  try {
    const client = new GoogleAndroidPublisher();

    const inAppProduct = await findInAppProductBySku(sku);

    if (!inAppProduct) {
      throw new InAppProductNotFoundError();
    }

    const purchase = await client.getInAppProductPurchase(sku, token);

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
};
