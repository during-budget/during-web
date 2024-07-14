import { PaymentModel } from "@models/payment.model";
import { Types } from "mongoose";

export class PaymentModelService {
  static readonly model = PaymentModel;

  static async destroyBulk(_ids: Array<Types.ObjectId | string>) {
    const destroyedAt = new Date();

    const updated = await this.model.updateMany(
      { _id: { $in: _ids }, isDestroyed: false },
      { isDestroyed: true, destroyedAt }
    );

    return { count: updated.modifiedCount };
  }
}
