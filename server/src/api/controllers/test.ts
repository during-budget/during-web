import { Request, Response } from "express";
import { logger } from "src/loggers";

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
