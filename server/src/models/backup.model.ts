import { Schema, Types, model } from "mongoose";

export enum EntityType {
  Agreement = "AGREEMENT",
  Budget = "BUDJET",
  Challenge = "CHALLENGE",
  Item = "ITEM",
  Payment = "PAYMENT",
  Transaction = "TRANSACTION",
  User = "USER",
  UserAgreement = "USER_AGREEMENT",
}

export interface BackupEntity {
  uuid: string;
  entityType: EntityType;
  entityId: Types.ObjectId;
  payload: object;
  isExpired: boolean;
  createdAt: Date;
  expiredAt?: Date;
}

const BackupSchema = new Schema<BackupEntity>({
  uuid: String,
  entityType: String,
  entityId: Types.ObjectId,
  payload: Object,
  isExpired: { type: Boolean, default: false },
  createdAt: Date,
  expiredAt: Date,
});

BackupSchema.index({ uuid: 1 });

BackupSchema.index(
  {
    entityType: 1,
    entityId: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      isExpired: { $eq: false },
    },
  }
);

export const BackupModel = model<BackupEntity>("Backup", BackupSchema);
