import { Types } from "mongoose";

export const findDocumentById = (params: {
  arr: any[];
  key?: string;
  id: Types.ObjectId | string;
}) => {
  const key = params.key ?? "_id";
  const id = new Types.ObjectId(params.id);

  for (let i = 0; i < params.arr.length; i++) {
    if (params.arr[i][key].equals(id)) {
      return { idx: i, value: params.arr[i] };
    }
  }
  return { idx: -1, value: undefined };
};
