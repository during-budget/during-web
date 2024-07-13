import { Schema, Types, model } from "mongoose";

export enum ItemType {
  ChartSkin = "chartSkin",
  Advertisement = "advertisement",
}
export interface ItemEntity {
  _id: Types.ObjectId;
  type: ItemType;
  title: string;
  price: Number;
}

export const itemSchema = new Schema<ItemEntity>(
  {
    type: String,
    title: String,
    price: { type: Number, default: 0 },
  },
  { timestamps: true }
);

itemSchema.index({ type: 1, title: 1 });

const ItemModel = model<ItemEntity>("Item", itemSchema);
export { ItemModel };
