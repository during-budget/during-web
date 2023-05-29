import { Schema, Types } from "mongoose";

export interface IAsset {
  _id: Types.ObjectId;
  icon: string;
  title: string;
  amount: number;
  detail: string;
}
export const assetSchema = new Schema<IAsset>({
  icon: { type: String, default: "" },
  title: String,
  amount: { type: Number, default: 0 },
  detail: { type: String, default: "" },
});

export interface ICard {
  _id: Types.ObjectId;
  icon: string;
  title: string;
  linkedAssetId?: Types.ObjectId;
  linkedAssetIcon?: string;
  linkedAssetTitle?: string;
  detail: string;
  paymentDate: number;
}

export const cardSchema = new Schema<ICard>({
  icon: { type: String, default: "" },
  title: String,
  linkedAssetId: Schema.Types.ObjectId,
  linkedAssetIcon: String,
  linkedAssetTitle: String,
  detail: { type: String, default: "" },
  paymentDate: { type: Number, default: 0 },
});

export interface IPaymentMethod {
  _id: Types.ObjectId;
  type: "asset" | "card";
  icon: string;
  title: string;
  detail: string;
  isChecked: boolean;
}

export const paymentMethodSchema = new Schema<IPaymentMethod>({
  type: String,
  icon: String,
  title: String,
  detail: { type: String, default: "" },
  isChecked: { type: Boolean, default: true },
});
