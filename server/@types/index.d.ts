import { IUser, IUserProps } from "../models/user";

declare global {
  namespace Express {
    interface User extends IUser, IUserProps {}
  }
}
