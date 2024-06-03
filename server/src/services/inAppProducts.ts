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
    console.log(
      "[TEST] InAppProductService.findInAppProductPurchase is called",
      { sku, token }
    );

    const client = new GoogleAndroidPublisher();

    console.log(
      "[TEST] InAppProductService.findInAppProductPurchase :: client is constructed"
    );

    const inAppProduct = await findInAppProductBySku(sku);

    if (!inAppProduct) {
      throw new InAppProductNotFoundError();
    }

    console.log(
      "[TEST] InAppProductService.findInAppProductPurchase :: inAppProduct is found",
      { inAppProduct }
    );

    const purchase = await client.getInAppProductPurchase(sku, token);

    console.log("[TEST] InAppProductService.findInAppProductPurchase :: ", {
      purchase,
    });

    if (!purchase) {
      throw new InAppProductPurchaseNotFoundError();
    }

    return purchase;
  } catch (err: any) {
    console.log(
      "[TEST] InAppProductService.findInAppProductPurchase::error",
      err
    );

    throw new Error(
      `Unexpected Error; Failed to get in-app product purchase (rawError: ${JSON.stringify(
        err?.response?.data?.error ?? {}
      )})`
    );
  }
};
