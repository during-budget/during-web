import _ from "lodash";

import { ICategory as ICategoryUser } from "../models/User";
import { ICategory as ICategoryBudget } from "../models/Budget";

interface ICategory extends ICategoryUser, ICategoryBudget {}

/**
 * 두 카테고리 배열을 비교한다. key가 같은 카테고리들을 동일한 카테고리로 보고 compareFunc으로 달라진 부분이 있는지 판단한다.
 * @param {params:{
 * prevArr: any[],
 * newArr: any[],
 * isEqual,
 * compareFunc:(val1: any, val2: any) => boolean,
 * key: string  }}
 */
export const compareCategories = (params: {
  prevArr: any[];
  newArr: any[];
  compareFunc: (val1: any, val2: any) => boolean;
  key?: string;
}) => {
  if (!params.key) params.key = "_id";

  const prevDict: { [key: string]: ICategory } = _.keyBy(
    params.prevArr,
    params.key
  );

  const updated = [];
  const added = [];
  for (let val of params.newArr) {
    const key = val[params.key]?.toString() ?? "";
    if (prevDict[key]) {
      if (!params.compareFunc(prevDict[key], val)) {
        updated.push(val);
      }
      delete prevDict[key];
    } else added.push(val);
  }
  const removed = Object.values(prevDict);

  return { updated, added, removed };
};
