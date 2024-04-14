import { GoogleAndroidPublisher, InAppProduct } from "src/lib/googleAPIs";

export const getInAppProducts = async (): Promise<{
  inAppProducts: Array<InAppProduct>;
}> => {
  const client = new GoogleAndroidPublisher();

  const { inappproduct } = await client.getInAppProductsRequest();

  return { inAppProducts: inappproduct };
};
