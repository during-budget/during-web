import { Item as ItemModel } from "src/models/Item";

export const create = async (
  type: "chartSkin",
  title: string,
  price: number
) => {
  const itemRecord = await ItemModel.create({
    type,
    title,
    price,
  });

  return { item: itemRecord };
};

export const findByType = async (type: string) => {
  const itemRecordList = await ItemModel.find({
    type,
  });

  return { items: itemRecordList };
};

export const updateById = async (
  itemId: string,
  title: string,
  price: number
) => {
  const itemRecord = await ItemModel.findByIdAndUpdate(
    itemId,
    {
      title,
      price,
    },
    { new: true }
  );

  return { item: itemRecord };
};

export const removeById = async (itemId: string) => {
  const itemRecord = await ItemModel.findByIdAndRemove(itemId, { new: true });

  return { item: itemRecord };
};
