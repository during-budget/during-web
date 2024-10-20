import { ItemEntity } from "@models/item.model";
import { UserEntity } from "@models/user.model";
import axios from "axios";
import { NotPermittedError } from "src/errors/ForbiddenError";
import {
  ItemNotFoundError,
  PaymentNotFoundError,
} from "src/errors/NotFoundError";
import {
  FakePaymentAttemptError,
  FetchingAccessTokenFailedError,
  FetchingPaymentFailedError,
  PaiedAlreadyError,
  PaymentIsNotPaidError,
  PaymentItemNotMatchError,
  PaymentUIDDuplicatedError,
  PaymentValidationFailedError,
} from "src/errors/PaymentError";
import { HydratedDocument, Types } from "mongoose";
import {
  PaymentEntity,
  PaymentModel,
  PaymentStatus,
  Platform,
} from "src/models/payment.model";
import { AndroidPurchaseState } from "src/types/payment.type";
import {
  ConflictError,
  InvalidInAppProductPurchaseStateError,
} from "src/errors/ConfilicError";
import * as ItemService from "./items";
import { GoogleInAppHelper } from "src/lib/googleInAppHelper";
import {
  CompletePaymentByMobileUserReq,
  InAppPlatform,
} from "src/types/payment";
import { RawPaymentDataByPlatform } from "src/types/payment.type";
import { AppleVerifyReceiptResultStatus, IAPHelper } from "src/lib/IAPHelper";

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
    throw new FetchingAccessTokenFailedError();
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
    return res.response as RawPaymentDataByPlatform<Platform.Portone>; // 조회한 결제 정보
  } catch (err: any) {
    switch (err.response.status) {
      case 404:
        throw new FetchingPaymentFailedError();
    }
    throw err;
  }
};

export const findPaymentById = async (paymentId: Types.ObjectId | string) => {
  const paymentRecord = await PaymentModel.findOne({
    _id: paymentId,
    isDestroyed: false,
  });
  return { payment: paymentRecord };
};

export const findPaymentPaidByTitle = async (
  userRecord: Pick<UserEntity, "_id">,
  itemTitle: string
) => {
  const paymentRecord = await PaymentModel.findOne({
    userId: userRecord._id,
    itemTitle,
    status: PaymentStatus.Paid,
    isDestroyed: false,
  });
  return { payment: paymentRecord };
};

export const findPaymentChartSkinPaidByTitle = async (
  userId: Types.ObjectId,
  chartSkinTitle: string
) => {
  const paymentRecord = await PaymentModel.findOne({
    userId,
    itemType: "chartSkin",
    itemTitle: chartSkinTitle,
    status: PaymentStatus.Paid,
    isDestroyed: false,
  });
  return { payment: paymentRecord };
};

export const findPaymentsChartSkinPaid = async (userId: Types.ObjectId) => {
  const paymentRecords = await PaymentModel.find({
    userId,
    itemType: "chartSkin",
    status: PaymentStatus.Paid,
    isDestroyed: false,
  });
  return { payments: paymentRecords };
};

export const findPaymentsByUserId = async (userId: Types.ObjectId | string) => {
  const paymentRecordList = await PaymentModel.find({
    userId,
    isDestroyed: false,
  });
  return { payments: paymentRecordList };
};

export const createPaymentReady = async (
  userRecord: UserEntity,
  itemRecord: ItemEntity
) => {
  const paymentRecord = await PaymentModel.create({
    userId: userRecord._id,
    itemId: itemRecord._id,
    itemType: itemRecord.type,
    itemTitle: itemRecord.title,
    amount: itemRecord.price,
    status: PaymentStatus.Ready,
  });

  /* Pre-register payment information */
  await preRegisterPaymentInfo(
    paymentRecord.merchant_uid,
    paymentRecord.amount
  );

  return { payment: paymentRecord };
};

export const completePaymentByUser = async (
  userRecord: UserEntity,
  imp_uid: string
) => {
  // 포트원 결제 정보 조회
  const rawPaymentData = await getRawPayment(imp_uid);

  // 포트원 결제 정보로 DB의 결제 정보 조회
  const paymentRecord = await PaymentModel.findOne({
    _id: rawPaymentData.merchant_uid,
    isDestroyed: false,
  });
  if (!paymentRecord) throw new PaymentNotFoundError();

  if (!paymentRecord.userId.equals(userRecord._id))
    throw new NotPermittedError();

  // 결제 정보 검증
  if (rawPaymentData.amount === paymentRecord.amount) {
    if (rawPaymentData.status === PaymentStatus.Paid) {
      // 웹훅이 먼저 호출되지 않은 경우 DB에 결제 정보 저장
      if (paymentRecord.status !== PaymentStatus.Paid) {
        paymentRecord.status = PaymentStatus.Paid;
        paymentRecord.rawPaymentData = rawPaymentData;

        paymentRecord.platform = Platform.Portone;
        paymentRecord.uid = rawPaymentData.merchant_uid;

        await paymentRecord.save();
      }
      return { payment: paymentRecord };
    }
    throw new PaymentIsNotPaidError();
  }

  throw new FakePaymentAttemptError();
};

export const completePaymentByWebhook = async (imp_uid: string) => {
  // 포트원 결제 정보 조회
  const rawPaymentData = await getRawPayment(imp_uid);

  // 포트원 결제 정보로 DB의 결제 정보 조회
  const paymentRecord = await PaymentModel.findOne({
    _id: rawPaymentData.merchant_uid,
    isDestroyed: false,
  });
  if (!paymentRecord) throw new PaymentNotFoundError();

  // DB에 결제 정보 저장
  if (rawPaymentData.amount === paymentRecord.amount) {
    if (rawPaymentData.status === PaymentStatus.Paid) {
      paymentRecord.status = PaymentStatus.Paid;
      paymentRecord.rawPaymentData = rawPaymentData;

      paymentRecord.platform = Platform.Portone;
      paymentRecord.uid = rawPaymentData.merchant_uid;

      await paymentRecord.save();
      return;
    }
    if (rawPaymentData.status === PaymentStatus.Cancelled) {
      paymentRecord.status = PaymentStatus.Cancelled;
      paymentRecord.rawPaymentData = rawPaymentData;
      await paymentRecord.save();
      return;
    }
    throw new PaymentIsNotPaidError();
  }
  throw new FakePaymentAttemptError();
};

export const completePaymentByMobileUser = async (
  req: CompletePaymentByMobileUserReq,
  userRecord: Pick<UserEntity, "_id">
): Promise<PaymentEntity> => {
  const { platform } = req;

  const inAppProductId =
    platform === InAppPlatform.Android
      ? req.payload.title
      : req.payload.productId;

  // itemRecord 조회
  const { item: itemRecord } = await ItemService.findByTitle(inAppProductId);

  if (!itemRecord) {
    throw new ItemNotFoundError();
  }

  // 이미 결제 완료된 상태의 payment가 있는지 확인
  const exPaymentRecord = await PaymentModel.findOne({
    userId: userRecord._id,
    itemId: itemRecord._id,
    status: PaymentStatus.Paid,
    isDestroyed: false,
  });

  if (exPaymentRecord) {
    throw new PaiedAlreadyError();
  }

  switch (platform) {
    case InAppPlatform.Android: {
      const {
        payload: { token },
      } = req;

      // 인앱 결제 정보 조회
      const helper = new GoogleInAppHelper();
      const rawPaymentData = await helper.findInAppProductPurchase(
        inAppProductId,
        token
      );

      switch (rawPaymentData.purchaseState) {
        case AndroidPurchaseState.PAID: {
          break;
        }

        case AndroidPurchaseState.CANCELLED:
        case AndroidPurchaseState.READY: {
          throw new InvalidInAppProductPurchaseStateError();
        }

        default:
          throw new Error(
            `Unexpected Error; Not supported purchase state (${rawPaymentData.purchaseState})`
          );
      }

      // DB에 결제 정보 생성
      const paymentRecord = await PaymentModel.create({
        userId: userRecord._id,
        itemId: itemRecord._id,
        itemType: itemRecord.type,
        itemTitle: itemRecord.title,
        amount: itemRecord.price,
        status: PaymentStatus.Paid,
        rawPaymentData: { ...rawPaymentData, token },
        platform: Platform.Android,
        uid: rawPaymentData.orderId,
      });

      return paymentRecord;
    }

    case InAppPlatform.IOS: {
      const { payload } = req;

      let resp = await IAPHelper.IOS.validate(
        payload.transactionReceipt,
        false
      );

      if (resp.status === AppleVerifyReceiptResultStatus.Error007) {
        resp = await IAPHelper.IOS.validate(payload.transactionReceipt, true);
      }

      const { status, rawPaymentData } = resp;

      if (status !== AppleVerifyReceiptResultStatus.Success) {
        throw new PaymentValidationFailedError({
          status,
          rawPaymentData,
        });
      }

      const { product_id: productId, transaction_id: transactionId } =
        rawPaymentData;

      if (itemRecord.title !== productId) {
        throw new PaymentItemNotMatchError({
          itemTitle: itemRecord.title,
          productId,
        });
      }

      const isUidDuplicated = !!(await PaymentModel.findOne({
        platform: Platform.IOS,
        uid: transactionId,
        isDestroyed: false,
      }));

      if (isUidDuplicated) {
        throw new PaymentUIDDuplicatedError({ uid: transactionId });
      }

      // DB에 결제 정보 생성
      const paymentRecord = await PaymentModel.create({
        userId: userRecord._id,
        itemId: itemRecord._id,
        itemType: itemRecord.type,
        itemTitle: itemRecord.title,
        amount: itemRecord.price,
        status: PaymentStatus.Paid,
        rawPaymentData: {
          ...rawPaymentData,
          transactionReceipt: payload.transactionReceipt,
        },
        platform: Platform.IOS,
        uid: transactionId,
      });

      return paymentRecord;
    }

    default: {
      throw new Error(`Unexpected Error; Not supported platform (${platform})`);
    }
  }
};

export const remove = async (
  paymentRecord: HydratedDocument<PaymentEntity>
) => {
  await paymentRecord.remove();
};
