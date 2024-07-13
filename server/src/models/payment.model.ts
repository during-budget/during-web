import { Schema, Types, model } from "mongoose";

export type TRawPayment = {
  imp_uid: "string";
  merchant_uid: "string";
  pay_method: "string";
  channel: "pc";
  pg_provider: "string";
  emb_pg_provider: "string";
  pg_tid: "string";
  pg_id: "string";
  escrow: true;
  apply_num: "string";
  bank_code: "string";
  bank_name: "string";
  card_code: "string";
  card_name: "string";
  card_quota: 0;
  card_number: "string";
  card_type: "null";
  vbank_code: "string";
  vbank_name: "string";
  vbank_num: "string";
  vbank_holder: "string";
  vbank_date: 0;
  vbank_issued_at: 0;
  name: "string";
  amount: 0;
  cancel_amount: 0;
  currency: "string";
  buyer_name: "string";
  buyer_email: "string";
  buyer_tel: "string";
  buyer_addr: "string";
  buyer_postcode: "string";
  custom_data: "string";
  user_agent: "string";
  status: "ready" | "paid" | "failed" | "cancelled";
  started_at: 0;
  paid_at: 0;
  failed_at: 0;
  cancelled_at: 0;
  fail_reason: "string";
  cancel_reason: "string";
  receipt_url: "string";
  cancel_history: [
    {
      pg_tid: "string";
      amount: 0;
      cancelled_at: 0;
      reason: "string";
      receipt_url: "string";
    }
  ];
  cancel_receipt_urls: ["string"];
  cash_receipt_issued: true;
  customer_uid: "string";
  customer_uid_usage: "issue";
};

export interface PaymentEntity {
  _id: Types.ObjectId;
  merchant_uid: string; // same as _id

  userId: Types.ObjectId;

  itemId: Types.ObjectId;
  itemType: "chartSkin";
  itemTitle: string;

  status: "ready" | "paid" | "cancelled";

  amount: number;

  /* raw info */
  rawPaymentData: any;
}

export const paymentSchema = new Schema<PaymentEntity>(
  {
    merchant_uid: String,

    userId: Types.ObjectId,

    itemId: Types.ObjectId,
    itemType: String,
    itemTitle: String,

    status: { type: String, default: "ready" },
    amount: Number,

    rawPaymentData: Object,
  },
  { timestamps: true }
);

paymentSchema.pre("save", function (next) {
  if (!this.merchant_uid) {
    this.merchant_uid = this._id.toString();
  }
  next();
});

const PaymentModel = model<PaymentEntity>("Payment", paymentSchema);
export { PaymentModel };
