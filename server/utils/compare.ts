import _ from "lodash";
import { HydratedDocument } from "mongoose";

import { ICategory } from "../models/User";

export const compareCategories = (
  prevArr: ICategory[],
  newArr: ICategory[],
  isEqual: (val1: ICategory, val2: ICategory) => boolean
) => {
  const prevDict: { [key: string]: ICategory } = _.keyBy(prevArr, "_id");

  const updated = [];
  const added = [];
  for (let val of newArr) {
    const _id = val._id?.toString() ?? "";
    if (prevDict[_id]) {
      if (!isEqual(prevDict[_id], val)) {
        updated.push(val);
      }
      delete prevDict[_id];
    } else added.push(val);
  }
  const removed = Object.values(prevDict);

  return { updated, added, removed };
};
