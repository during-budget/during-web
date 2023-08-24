import { IUser } from "src/models/User";
import { Types } from "mongoose";
import { findDocumentById } from "src/utils/document";

export const findById = (userRecord: IUser, _id: Types.ObjectId) => {
  const { idx, value } = findDocumentById({
    arr: userRecord.cards,
    id: _id,
  });
  return { idx, card: value };
};
