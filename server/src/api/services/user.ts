import { AgreementModel } from "@models/Agreement";
import { UserEntity } from "@models/User";
import { UserAgreementModel } from "@models/UserAgreement";
import { InvalidError } from "src/errors/InvalidError";
import { AgreementNotFoundError } from "src/errors/NotFoundError";
import { AgreementType } from "src/types/agreement";
import { User, convertToUser } from "src/types/user";

const agree = async (
  user: Pick<UserEntity, "_id">,
  type: AgreementType,
  version: string
) => {
  const agreement = await AgreementModel.findOne({
    type,
    version,
  });

  if (!agreement) {
    throw new AgreementNotFoundError(JSON.stringify({ type, version }));
  }

  if (agreement.isDestroyed) {
    throw new InvalidError(
      `Agreement(${JSON.stringify({ type, version })}) is destroyed`
    );
  }

  const exUserAgreement = await UserAgreementModel.findOne({
    userId: user._id,
    agreementId: agreement._id,
  });

  if (exUserAgreement) {
    throw new InvalidError(
      `Agreement is already made (${JSON.stringify({ type, version })})`
    );
  }

  await UserAgreementModel.create({
    userId: user._id,
    agreementId: agreement._id,
  });

  return agreement;
};

export const updateAgreement = async (
  userEntity: UserEntity,
  req: {
    termsOfUse: string;
    privacyPolicy: string;
  }
): Promise<{
  termsOfUse: string;
  privacyPolicy: string;
}> => {
  const {
    termsOfUse: termsOfUseAgreementVersion,
    privacyPolicy: privacyPoilicyVersion,
  } = req;

  const [termsOfUseAgreement, privacyPolicyAgreement] = await Promise.all([
    agree(userEntity, AgreementType.TermsOfUse, termsOfUseAgreementVersion),
    agree(userEntity, AgreementType.PrivacyPolicy, privacyPoilicyVersion),
  ]);

  return {
    termsOfUse: termsOfUseAgreement.version,
    privacyPolicy: privacyPolicyAgreement.version,
  };
};

export const current = async (userEntity: UserEntity): Promise<User> => {
  const agreementIds = (
    await UserAgreementModel.find({
      userId: userEntity._id,
    })
  ).map(({ agreementId }) => agreementId);

  const agreements = await AgreementModel.find({ _id: { $in: agreementIds } });

  return convertToUser(userEntity, { agreements });
};
