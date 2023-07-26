import { Request, Response } from "express";
import _ from "lodash";

import { logger } from "@logger";
import {
  FAKE_PAYMENT_ATTEMPT,
  FETCHING_ACCESSTOKEN_FAILED,
  FIELD_INVALID,
  FIELD_REQUIRED,
  NOT_FOUND,
  NOT_PERMITTED,
  PAIED_ALREADY,
} from "../@message";
import { Item } from "@models/Item";
import { Payment, TRawPayment } from "@models/Payment";
import axios from "axios";

/**
 * @function getAccessToken
 * @description accessToken을 발급받는 PortOne API 호출
 *
 * @returns accessToken
 *
 * @throws {401 FETCHING_ACCESSTOKEN_FAILED}
 */
const getAccessToken = async () => {
  try {
    const { data: res } = await axios({
      url: "https://api.iamport.kr/users/getToken",
      method: "post",
      headers: { "Content-Type": "application/json" },
      data: {
        imp_key: process.env.PORTONE_IMP_KEY,
        imp_secret: process.env.PORTONE_IMP_SECRET,
      },
    });
    return res.response.access_token;
  } catch (err: any) {
    err.status = 401;
    err.message = FETCHING_ACCESSTOKEN_FAILED;
    throw err;
  }
};

/**
 * @function preRegisterPaymentInfo
 * @description 결제예정금액을 사전등록하는 PortOne API 호출
 *
 * @param merchant_uid
 * @param amount
 *
 */
const preRegisterPaymentInfo = async (merchant_uid: string, amount: number) => {
  const accessToken = await getAccessToken();

  try {
    await axios({
      url: "https://api.iamport.kr/payments/prepare",
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
      data: {
        merchant_uid, // 주문번호
        amount, // 결제 예정금액
      },
    });
  } catch (err: any) {
    throw err;
  }
};

/**
 * @function getRawPayment
 * @description 아임포트 고유번호로 결제내역을 조회하는 PortOne API 호출
 *
 * @param imp_uid - 아임포트 고유번호
 *
 * @throws  {404 IMP_UID_INVALID}
 */
const getRawPayment = async (imp_uid: string) => {
  const accessToken = await getAccessToken();

  try {
    const { data: res } = await axios({
      url: `https://api.iamport.kr/payments/${imp_uid}`,
      method: "get",
      headers: { Authorization: accessToken },
    });
    return res.response as TRawPayment; // 조회한 결제 정보
  } catch (err: any) {
    switch (err.response.status) {
      case 404:
        err.status = 404;
        err.message = FIELD_INVALID("imp_uid");
        break;
    }
    throw err;
  }
};

export const prepare = async (req: Request, res: Response) => {
  try {
    /* validate */
    if (!("itemTitle" in req.body)) {
      return res.status(400).send({ message: FIELD_REQUIRED("itemTitle") });
    }

    const user = req.user!;

    // if (user.isGuest) {
    //   return res.status(403).send({ message: NOT_PERMITTED });
    // }

    if (
      await Payment.findOne({
        userId: user._id,
        itemTitle: req.body.itemTitle,
        status: "paid",
      })
    ) {
      return res.status(409).send({ message: PAIED_ALREADY });
    }

    const item = await Item.findOne({ title: req.body.itemTitle });
    if (!item) {
      return res.status(404).send({ message: NOT_FOUND("item") });
    }

    /* create payment */
    const payment = await Payment.create({
      userId: user._id,
      itemId: item._id,
      itemType: item.type,
      itemTitle: item.title,
      status: "ready",
      amount: item.price,
    });

    /* Pre-register payment information */
    await preRegisterPaymentInfo(payment.merchant_uid, payment.amount);

    return res.status(200).send({
      payment,
    });
  } catch (err: any) {
    logger.error(err.message);
    return res.status(err.status ?? 500).send({ message: err.message });
  }
};

export const completeByUser = async (req: Request, res: Response) => {
  try {
    /* validate */
    for (let field of ["imp_uid", "merchant_uid"]) {
      if (!(field in req.body)) {
        return res.status(400).send({ message: FIELD_REQUIRED(field) });
      }
    }

    const user = req.user!;

    // 포트원 결제 정보 조회
    const rawPaymentData = await getRawPayment(req.body.imp_uid);

    // 포트원 결제 정보로 DB의 결제 정보 조회
    const payment = await Payment.findById(rawPaymentData.merchant_uid);
    if (!payment) {
      return res.status(404).send({ message: NOT_FOUND("payment") });
    }

    if (!payment.userId.equals(user._id)) {
      return res.status(403).send({ message: NOT_PERMITTED });
    }

    // 결제 정보 검증
    if (rawPaymentData.amount === payment.amount) {
      if (rawPaymentData.status === "paid") {
        // 웹훅이 먼저 호출되지 않은 경우 DB에 결제 정보 저장
        if (payment.status !== "paid") {
          payment.status = "paid";
          payment.rawPaymentData = rawPaymentData;
          await payment.save();
        }
        return res.status(200).send({ payment });
      }
      return res.status(404).send({});
    }

    return res.status(409).send({ message: FAKE_PAYMENT_ATTEMPT });
  } catch (err: any) {
    logger.error(err.message);
    return res.status(err.status ?? 500).send({ message: err.message });
  }
};

export const completeByWebhook = async (req: Request, res: Response) => {
  try {
    /* validate */
    for (let field of ["imp_uid", "merchant_uid", "status"]) {
      if (!(field in req.body)) {
        return res.status(400).send({ message: FIELD_REQUIRED(field) });
      }
    }

    // 포트원 결제 정보 조회
    const rawPaymentData = await getRawPayment(req.body.imp_uid);

    // 포트원 결제 정보로 DB의 결제 정보 조회
    const payment = await Payment.findById(rawPaymentData.merchant_uid);
    if (!payment) {
      return res.status(404).send({ message: NOT_FOUND("payment") });
    }

    // DB에 결제 정보 저장
    if (rawPaymentData.amount === payment.amount) {
      if (rawPaymentData.status === "paid") {
        payment.status = "paid";
        payment.rawPaymentData = rawPaymentData;
        await payment.save();
        return res.status(200).send();
      }
      if (rawPaymentData.status === "cancelled") {
        payment.status = "cancelled";
        payment.rawPaymentData = rawPaymentData;
        await payment.save();
        return res.status(200).send();
      }
      return res.status(404).send();
    }
    return res.status(409).send({ message: FAKE_PAYMENT_ATTEMPT });
  } catch (err: any) {
    logger.error(err.message);
    return res.status(err.status ?? 500).send({ message: err.message });
  }
};

export const find = async (req: Request, res: Response) => {
  try {
    const user = req.user!;

    if ("userId" in req.query) {
      if (user.auth !== "admin") {
        return res.status(403).send({ message: NOT_PERMITTED });
      }
      const payments = await Payment.find({ userId: req.query.userId });
      return res.status(200).send({ payments });
    }
    const payments = await Payment.find({ userId: user._id });
    return res.status(200).send({ payments });
  } catch (err: any) {
    logger.error(err.message);
    return res.status(500).send({ message: err.message });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params._id);

    if (!payment) {
      return res.status(404).send({ message: NOT_FOUND("payment") });
    }
    return res.status(200).send({});
  } catch (err: any) {
    logger.error(err.message);
    return res.status(500).send({ message: err.message });
  }
};
