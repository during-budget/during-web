import { PaymentService } from "src/services/payment.service";

export class SyncPaymentCancellationTask {
  static failedCnt = 0;

  static async run() {
    try {
      console.log("[SyncPaymentCancellationTask] Task started at:", new Date());

      const { found, updated } =
        await PaymentService.syncCancelledInappPayments();

      console.log(
        "[SyncPaymentCancellationTask] Task completed at:",
        new Date(),
        found === 0
          ? "; No records to update"
          : `; found: ${found}; updated: ${updated}.`
      );

      if (this.failedCnt) this.failedCnt = 0;
    } catch (err) {
      console.log(
        `[SyncPaymentCancellationTask] Task Failed(${this.failedCnt++}): `,
        err
      );
    } finally {
      if (this.failedCnt < 10) {
        setTimeout(this.run.bind(this), 60000);
      }
    }
  }
}
