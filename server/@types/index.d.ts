import { HydratedDocument, Types } from "mongoose";
import {
  IAsset,
  ICard,
  ICategory,
  IPaymentMethod,
  IUser,
  IUserProps,
} from "src/models/User";

declare global {
  namespace Express {
    interface User extends HydratedDocument<IUser, IUserProps> {
      categories: Types.DocumentArray<ICategory>;
      assets: Types.DocumentArray<IAsset>;
      cards: Types.DocumentArray<ICard>;
      paymentMethods: Types.DocumentArray<IPaymentMethod>;
    }
  }
}
