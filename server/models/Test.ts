import { Schema, model, Types } from "mongoose";

interface ITest {
  _id: Types.ObjectId;
  data: any;
}

const testSchema = new Schema<ITest>(
  {
    data: Object,
  },
  { timestamps: true }
);

const Test = model<ITest>("Test", testSchema);
export { Test };
