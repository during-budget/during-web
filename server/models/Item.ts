import { Schema, Types, model } from "mongoose";

export interface IItem {
  _id: Types.ObjectId;
  type: "charSkin";
  title: string;
  description?: string;
  price: Number;
}

export const itemSchema = new Schema<IItem>({
  type: String,
  title: String,
  description: String,
  price: { type: Number, default: 0 },
});

const Item = model<IItem>("Item", itemSchema);
export { Item };
