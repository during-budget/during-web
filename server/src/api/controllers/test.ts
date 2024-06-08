import { ItemEntity, ItemModel, ItemType } from "@models/Item";
import { ChartSkinTitle } from "@models/_basicSettings";
import { Request, Response } from "express";
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
