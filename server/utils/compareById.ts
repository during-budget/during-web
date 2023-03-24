import _ from "lodash";
import { HydratedDocument, Types } from "mongoose";

import { ICategory } from "../models/User";

module.exports = (
  prevArr: HydratedDocument<ICategory>[],
  newArr: HydratedDocument<ICategory>[],
  isEqual: (
    val1: HydratedDocument<ICategory>,
    val2: HydratedDocument<ICategory>
  ) => boolean
) => {
  const prevDict: { [key: string]: HydratedDocument<ICategory> } = _.keyBy(
    prevArr,
    "_id"
  );

  const updated = [];
  const added = [];
  for (let val of newArr) {
    const _id = val?._id.toString();
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
