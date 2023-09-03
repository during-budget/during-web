import { Types } from "mongoose";
import { Payment } from "src/models/Payment";

export const findPaymentChartSkinPaidByTitle = async (
  userId: Types.ObjectId,
  chartSkinTitle: string
) => {
  const paymentRecord = await Payment.findOne({
    userId,
    itemType: "chartSkin",
    itemTitle: chartSkinTitle,
    status: "paid",
  });
  return { payment: paymentRecord };
};

export const findPaymentsChartSkinPaid = async (userId: Types.ObjectId) => {
  const paymentRecords = await Payment.find({
    userId,
    itemType: "chartSkin",
    status: "paid",
  });
  return { payments: paymentRecords };
};
