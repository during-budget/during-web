import { Schema, Types, model } from "mongoose";

export enum PaymentStatus {
  Ready = "ready",
  Paid = "paid",
  Cancelled = "cancelled",
}

export enum Platform {
  Portone = "portone",
  Android = "android",
  IOS = "ios",
}

export interface PaymentEntity {
  _id: Types.ObjectId;
  platform: Platform;
  uid: string;

  /** @deprecated */
  merchant_uid: string; // same as _id

  userId: Types.ObjectId;

  itemId: Types.ObjectId;
  itemType: "chartSkin";
  itemTitle: string;

  status: PaymentStatus;

  amount: number;

  /* raw info */
  rawPaymentData: Object;

  isDestroyed: boolean;
  destroyedAt?: Date;
}

export const paymentSchema = new Schema<PaymentEntity>(
  {
    merchant_uid: String,
    platform: String,
    uid: String,

    userId: Types.ObjectId,

    itemId: Types.ObjectId,
    itemType: String,
    itemTitle: String,

    status: { type: String, default: PaymentStatus.Ready },
    amount: Number,

    rawPaymentData: Object,

    isDestroyed: { type: Boolean, default: false },

    destroyedAt: Date,
  },
  { timestamps: true }
);

paymentSchema.pre("save", function (next) {
  if (!this.merchant_uid) {
    this.merchant_uid = this._id.toString();
  }
  next();
});

paymentSchema.index(
  {
    platform: 1,
    uid: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      isDestroyed: { $eq: false },
    },
  }
);

const PaymentModel = model<PaymentEntity>("Payment", paymentSchema);
export { PaymentModel };
