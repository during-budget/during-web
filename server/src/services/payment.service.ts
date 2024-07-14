import { PaymentModelService } from "./payment.model.service";
import { PaymentStatus } from "@models/payment.model";

export class PaymentService {
  static readonly modelService = PaymentModelService;

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
