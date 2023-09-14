import { Request, Response } from "express";
import _ from "lodash";

import { FieldInvalidError, FieldRequiredError } from "errors/InvalidError";
import * as ChallengeService from "src/services/challenges";
import { isAdmin } from "src/services/users/auth";
import { NotPermittedError } from "errors/ForbiddenError";
import { ChallengeNotFoundError } from "errors/NotFoundError";

export const create = async (req: Request, res: Response) => {
  const user = req.user!;

  for (let field of ["startDate", "endDate", "type", "amount", "comparison"]) {
    if (!(field in req.body)) {
      throw new FieldRequiredError(field);
    }
  }
  if (
    req.body.comparison !== "lt" &&
    req.body.comparison !== "lte" &&
    req.body.comparison !== "gt" &&
    req.body.comparison !== "gte"
  ) {
    throw new FieldInvalidError("comparison");
  }

  const startDate = new Date(req.body.startDate);
  const endDate = new Date(req.body.endDate);
  const type = req.body.type as string;
  const amount = req.body.amount as number;
  const comparison = req.body.comparison as "lt" | "lte" | "gt" | "gte";

  if (type === "category") {
    const categoryId = req.body.categoryId;

    if (!categoryId) {
      throw new FieldRequiredError("categoryId");
    }

    const { challenge } = await ChallengeService.createCategoryChallenge(
      user,
      categoryId,
      {
        startDate,
        endDate,
        amount,
        comparison,
      }
    );
    const { transactions } = await ChallengeService.findChallengeTransactions(
      user,
      challenge
    );

    return res.status(200).send({
      challenge,
      transactions,
    });
  } else if (type === "tag") {
    const tag = req.body.tag as string | undefined;
    if (!tag) {
      throw new FieldRequiredError("tag");
    }

    const { challenge } = await ChallengeService.createTagChallenge(user, tag, {
      startDate,
      endDate,
      amount,
      comparison,
    });
    const { transactions } = await ChallengeService.findChallengeTransactions(
      user,
      challenge
    );

    return res.status(200).send({
      challenge,
      transactions,
    });
  } else {
    throw new FieldInvalidError("type");
  }
};

export const find = async (req: Request, res: Response) => {
  const user = req.user!;

  let userId: string = user._id.toString();
  if ("userId" in req.query) {
    if (!isAdmin(user)) throw new NotPermittedError();
    userId = req.query.userId as string;
  }

  const { challenges } = await ChallengeService.findByUserId(userId);
  const transactionsList = await Promise.all(
    challenges.map((challenge) =>
      ChallengeService.findChallengeTransactions(user, challenge)
    )
  );

  return res.status(200).send({
    challengeList: challenges.map((challenge, idx) => {
      return {
        ...challenge.toObject(),
        transactions: transactionsList[idx],
      };
    }),
  });
};

export const remove = async (req: Request, res: Response) => {
  const user = req.user!;

  const challengeId: string = req.params._id as string;

  const { challenge } = await ChallengeService.findById(challengeId);
  if (!challenge) throw new ChallengeNotFoundError();

  if (!ChallengeService.isUser(challenge, user)) throw new NotPermittedError();

  await ChallengeService.remove(challenge);
  return res.status(200).send();
};
