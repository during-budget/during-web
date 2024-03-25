import { Schema, Types, model } from "mongoose";
import { AgreementType } from "src/types/agreement";

export interface AgreementEntity {
  _id: Types.ObjectId;
  type: AgreementType;
  version: string;
  isDestroyed: boolean;
}

const AgreementSchema = new Schema<AgreementEntity>(
  {
    type: String,
    version: String,
    isDestroyed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

AgreementSchema.index(
  {
    type: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      isDestroyed: { $eq: false },
    },
  }
);

export const AgreementModel = model<AgreementEntity>(
  "Agreement",
  AgreementSchema
);
