import { Schema, Types, model } from "mongoose";

export interface IChallenge {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  startDate: Date;
  endDate: Date;
  type: "category" | "tag";
  categoryId?: Types.ObjectId;
  tag?: string;
  amount: Number;
  comparison: "lt" | "lte" | "gt" | "gte";
}

export const challengeSchema = new Schema<IChallenge>(
  {
    userId: Schema.Types.ObjectId,
    startDate: Date,
    endDate: Date,
    type: {
      type: String,
      enum: ["category", "tag"],
    },
    categoryId: Schema.Types.ObjectId,
    tag: String,
    amount: { type: Number, default: 0 },
    comparison: {
      type: String,
      enum: ["lt", "lte", "gt", "gte"],
    },
  },
  { timestamps: true }
);

challengeSchema.index({ userId: 1 });

const Challenge = model<IChallenge>("Challenge", challengeSchema);
export { Challenge };
