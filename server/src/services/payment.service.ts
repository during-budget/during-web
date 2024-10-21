import { HydratedDocument, Types } from "mongoose";
import { PaymentModelService } from "./payment.model.service";
import { PaymentEntity, PaymentStatus, Platform } from "@models/payment.model";
import { GoogleInAppHelper } from "src/lib/googleInAppHelper";
import { AndroidPurchaseState } from "src/types/payment.type";
import { AppleVerifyReceiptResultStatus, IAPHelper } from "src/lib/IAPHelper";

const BATCH_SIZE = 100;
export class PaymentService {
  static readonly modelService = PaymentModelService;

  static async syncCancelledInappPayments() {
    const paymentIdsToCancel: Array<Types.ObjectId> = [];
    const helper = new GoogleInAppHelper();

    let skip = 0;
    let hasMore = true;

    while (hasMore) {
      const paidPayments = await this.modelService.model
        .find({
          status: PaymentStatus.Paid,
          platform: { $in: [Platform.Android, Platform.IOS] },
          isDestroyed: false,
        })
        .skip(skip)
        .limit(BATCH_SIZE)
        .exec();

      await Promise.all(
        paidPayments.map(async (payment) => {
          switch (payment.platform) {
            case Platform.Android: {
              if (
                !(
                  "token" in payment.rawPaymentData &&
                  typeof payment.rawPaymentData.token === "string" &&
                  payment.rawPaymentData.token
                )
              ) {
                return;
              }

              const { purchaseState } = await helper.findInAppProductPurchase(
                payment.itemTitle,
                payment.rawPaymentData.token
              );

              if (purchaseState === AndroidPurchaseState.CANCELLED) {
                paymentIdsToCancel.push(payment._id);
              }

              break;
            }

            case Platform.IOS: {
              if (
                !(
                  "transactionReceipt" in payment.rawPaymentData &&
                  typeof payment.rawPaymentData.transactionReceipt ===
                    "string" &&
                  payment.rawPaymentData.transactionReceipt
                )
              ) {
                return;
              }

              const transactionReceipt =
                payment.rawPaymentData.transactionReceipt;

              const validated = await (async () => {
                const validated1 = await IAPHelper.IOS.validate(
                  transactionReceipt,
                  false
                );

                switch (validated1.status) {
                  case AppleVerifyReceiptResultStatus.Success: {
                    return validated1;
                  }

                  case AppleVerifyReceiptResultStatus.Error007: {
                    const validated2 = await IAPHelper.IOS.validate(
                      transactionReceipt,
                      true
                    );

                    switch (validated2.status) {
                      case AppleVerifyReceiptResultStatus.Success: {
                        return validated2;
                      }

                      default: {
                        return null;
                      }
                    }
                  }

                  default: {
                    return null;
                  }
                }
              })();

              if (!validated) {
                return null;
              }

              if ("cancellation_date" in validated.rawPaymentData) {
                paymentIdsToCancel.push(payment._id);
              }

              break;
            }

            default: {
              break;
            }
          }
        })
      );

      // 더 가져올 데이터가 있는지 확인
      if (paidPayments.length < BATCH_SIZE) {
        hasMore = false;
      }

      // 다음 배치를 위해 skip 값 업데이트
      skip += BATCH_SIZE;
    }

    const result = await this.modelService.model.updateMany(
      { _id: { $in: paymentIdsToCancel }, status: PaymentStatus.Paid },
      { $set: { status: PaymentStatus.Cancelled } }
    );

    return {
      found: paymentIdsToCancel.length,
      updated: result.modifiedCount,
    };
  }

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
