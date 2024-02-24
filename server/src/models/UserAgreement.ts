import { Schema, Types, model } from "mongoose";

export interface UserAgreementEntity {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  agreementId: Types.ObjectId;
}

const UserAgreementSchema = new Schema<UserAgreementEntity>(
  {
    userId: Schema.Types.ObjectId,
    agreementId: Schema.Types.ObjectId,
  },
  { timestamps: true }
);

export const UserAgreementModel = model<UserAgreementEntity>(
  "UserAgreement",
  UserAgreementSchema
);
