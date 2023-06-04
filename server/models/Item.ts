import { Schema, Types, model } from "mongoose";

export interface IItem {
  _id: Types.ObjectId;
  type: "chartSkin";
  title: string;
  price: Number;
}

export const itemSchema = new Schema<IItem>(
  {
    type: String,
    title: String,
    price: { type: Number, default: 0 },
  },
  { timestamps: true }
);

itemSchema.index({ type: 1, title: 1 });

const Item = model<IItem>("Item", itemSchema);
export { Item };
