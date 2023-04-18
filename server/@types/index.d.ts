import { Types } from "mongoose";
import {
  IAsset,
  ICard,
  ICategory,
  IPaymentMethod,
  IUser,
  IUserProps,
} from "../models/User";

declare global {
  namespace Express {
    interface User extends IUser, IUserProps {
      categories: Types.DocumentArray<ICategory>;
      assets: Types.DocumentArray<IAsset>;
      cards: Types.DocumentArray<ICard>;
      paymentMethods: Types.DocumentArray<IPaymentMethod>;
    }
  }
}
