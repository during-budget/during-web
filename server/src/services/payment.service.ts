import { Document, HydratedDocument } from "mongoose";
import { PaymentModelService } from "./payment.model.service";
import { PaymentEntity, PaymentStatus, Platform } from "@models/payment.model";

export class PaymentService {
  static readonly modelService = PaymentModelService;

  /** migration */
  static async setPlatform() {
    const records = await this.modelService.model.find({
      rawPaymentData: { $exists: true },
      isDestroyed: false,
    });

    const invalidRecords: Array<HydratedDocument<PaymentEntity>> = [];
    const recordsToUpdate: Array<HydratedDocument<PaymentEntity>> = [];

    records.forEach((record) => {
      if (
        "user_agent" in record.rawPaymentData &&
        "merchant_uid" in record.rawPaymentData &&
        typeof record.rawPaymentData.merchant_uid === "string"
      ) {
        record.platform = Platform.Portone;
        record.uid = record.rawPaymentData.merchant_uid;
        recordsToUpdate.push(record);
      } else if (
        "kind" in record.rawPaymentData &&
        "orderId" in record.rawPaymentData &&
        typeof record.rawPaymentData.orderId === "string"
      ) {
        record.platform = Platform.Android;
        record.uid = record.rawPaymentData.orderId;
        recordsToUpdate.push(record);
      } else {
        invalidRecords.push(record);
      }
    });

    if (invalidRecords.length) {
      return { result: false, invalidRecords };
    }

    const updated = await Promise.all(
      recordsToUpdate.map((record) => {
        return record.save();
      })
    );

    return { result: true, count: updated.length };
  }

  /** migration */
  static async setIsDestroyed() {
    const updated = await this.modelService.model.updateMany(
      {
        isDestroyed: { $exists: false },
      },
      { isDestroyed: false }
    );

    console.log(
      `[MIGRATION] isDestroyed column of ${updated.modifiedCount} payments is set`
    );

    return { count: updated.modifiedCount };
  }

  /** migration */
  static async destroyUnpaidPayments() {
    const unPaidPaymentIds = (
      await this.modelService.model.find({
        status: { $ne: PaymentStatus.Paid },
        isDestroyed: false,
      })
    ).map((record) => record._id);

    console.log("DEBUG:: unPaidPaymentIds: ", unPaidPaymentIds.length);
    const { count } = await this.modelService.destroyBulk(unPaidPaymentIds);

    console.log(`[MIGRATION] unpaid payments are destroyed: ${count}`);

    return { count };
  }
}
