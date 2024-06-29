import { Request, Response } from "express";
import _ from "lodash";

import * as UserService from "src/services/users";
import { UserNotFoundError } from "src/errors/NotFoundError";

//_____________________________________________________________________________

/**
 * Update fields(userName, birthdate, gender, tel)
 */
export const updateFields = async (req: Request, res: Response) => {
  const user = req.user!;
  await UserService.updateFields(user, req.body);

  return res.status(200).send({
    userName: user.userName,
    birthdate: user.birthdate,
    gender: user.gender,
    tel: user.tel,
  });
};

export const remove = async (req: Request, res: Response) => {
  const user = req.user!;

  await UserService.remove(user);

  return res.status(200).send({});
};

/* admin */
export const listByAdmin = async (req: Request, res: Response) => {
  const { users } = await UserService.findAll();
  return res.status(200).send({ users });
};

export const findByAdmin = async (req: Request, res: Response) => {
  const { user } = await UserService.findById(req.params._id);
  return res.status(200).send({ user });
};

export const removeByAdmin = async (req: Request, res: Response) => {
  const { user } = await UserService.findById(req.params._id);
  if (!user) throw new UserNotFoundError();

  await UserService.remove(user);

  return res.status(200).send({});
};
