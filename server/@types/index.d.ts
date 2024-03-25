import { HydratedDocument, Types } from "mongoose";
import {
  IAsset,
  ICard,
  ICategory,
  IPaymentMethod,
  UserEntity,
  IUserProps,
} from "src/models/User";

declare global {
  namespace Express {
    interface User extends HydratedDocument<UserEntity, IUserProps> {
      categories: Types.DocumentArray<ICategory>;
      assets: Types.DocumentArray<IAsset>;
      cards: Types.DocumentArray<ICard>;
      paymentMethods: Types.DocumentArray<IPaymentMethod>;
    }
  }
}
