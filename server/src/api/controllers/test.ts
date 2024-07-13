import { ItemEntity, ItemModel, ItemType } from "@models/item.model";
import { PaymentModel } from "@models/payment.model";
import { UserModel } from "@models/user.model";
import { ChartSkinTitle } from "@models/_basicSettings";
import { Request, Response } from "express";
import { countBy, groupBy } from "lodash";
import { HydratedDocument } from "mongoose";
import { logger } from "src/api/middleware/loggers";

/**
 * Hello
 *
 * @return message: 'hello world'
 */
export const hello = async (req: Request, res: Response) => {
  try {
    return res.status(200).send({ message: "hello world!" });
  } catch (err: any) {
    logger.error(err.message);
    return res.status(500).send({ message: err.message });
  }
};

export const migrateItemPrices = async (req: Request, res: Response) => {
  try {
    const itemRecordList = await ItemModel.find();

    const itemsToUpdate = itemRecordList.reduce<
      Array<HydratedDocument<ItemEntity>>
    >((prev, item) => {
      switch (item.type) {
        case ItemType.ChartSkin: {
          if (item.title !== ChartSkinTitle.Basic && item.price !== 1500) {
            item.price = 1500;

            prev.push(item);
          }
          break;
        }

        case ItemType.Advertisement: {
          if (item.price !== 4900) {
            item.price = 4900;

            prev.push(item);
          }
          break;
        }

        default: {
          console.log(
            `Unexpected Error; Not supported item type (title: ${item.title}, type: ${item.type})`
          );
        }
      }

      return prev;
    }, []);

    await Promise.all(itemsToUpdate.map((item) => item.save()));

    return res.status(200).send({
      message: `Migration Done; ${itemsToUpdate.length} items are updated`,
    });
  } catch (err: any) {
    logger.error(err.message);
    return res.status(500).send({ message: err.message });
  }
};

export const migrateChartSkinCatToBasic = async (
  req: Request,
  res: Response
) => {
  try {
    const usersAll = await UserModel.find({});

    const catUsers = await UserModel.find({
      "settings.chartSkin": ChartSkinTitle.Cat,
    });

    const paidCatUsersIdSet = new Set(
      (
        await PaymentModel.find({
          userId: { $in: catUsers.map(({ _id }) => _id) },
          itemType: "chartSkin",
          itemTitle: ChartSkinTitle.Cat,
          status: "paid",
        })
      ).map(({ userId }) => userId.toString())
    );

    const notPaidCatUsers = catUsers.filter(
      (user) => !paidCatUsersIdSet.has(user._id.toString())
    );

    await Promise.all(
      notPaidCatUsers.map((user) => {
        user.settings = { ...user.settings, chartSkin: ChartSkinTitle.Basic };

        return user.save();
      })
    );

    return res.status(200).send({
      message: `Migration Done; ${notPaidCatUsers.length} user settings are updated`,
    });
  } catch (err: any) {
    logger.error(err.message);
    return res.status(500).send({ message: err.message });
  }
};

export const checkDuplicatedPayments = async (req: Request, res: Response) => {
  try {
    const payments = (await PaymentModel.find({ status: "paid" })).map(
      (payment) => ({
        _id: payment._id,
        userId: payment.userId,
        itemId: payment.itemId,
        createdAt: (payment as any).createdAt,
        key: [payment.userId.toString(), payment.itemId.toString()].join("//"),
      })
    );

    const paymentsByKey = groupBy(payments, "key");
    const duplicatedPayments: Array<{ key: string; payments: Array<object> }> =
      [];

    for (const [key, payments] of Object.entries(paymentsByKey)) {
      if (payments.length > 1) {
        duplicatedPayments.push({ key, payments });
      }
    }

    return res.status(200).send({
      duplicatedPaymentsCnt: duplicatedPayments.length,
      duplicatedPayments,
      paymentsByKeyCnt: paymentsByKey.length,
      paymentsByKey,
    });
  } catch (err: any) {
    logger.error(err.message);
    return res.status(500).send({ message: err.message });
  }
};
