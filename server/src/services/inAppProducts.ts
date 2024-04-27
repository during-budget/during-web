import { InAppProductNotFoundError } from "src/errors/NotFoundError";
import { GoogleAndroidPublisher, InAppProduct } from "src/lib/googleAPIs";

export const getInAppProducts = async (): Promise<{
  inAppProducts: Array<InAppProduct>;
}> => {
  const client = new GoogleAndroidPublisher();

  const { inappproduct } = await client.getInAppProductsRequest();

  return { inAppProducts: inappproduct };
};

export const findInAppProductBySku = async (
  sku: string
): Promise<InAppProduct> => {
  const client = new GoogleAndroidPublisher();

  return client.getInAppProductRequest(sku);
};

export const isInAppProductActive = async (sku: string): Promise<boolean> => {
  const inAppProduct = await findInAppProductBySku(sku);

  if (!inAppProduct) {
    throw new InAppProductNotFoundError();
  }

  return inAppProduct.status === "active";
};
