import { Request, Response } from "express";
import { AgreementModel, AgreementEntity } from "@models/agreement.model";
import { AgreementType } from "src/types/agreement";

export const createAgreement = async (req: {
  type: AgreementType;
  version: string;
}): Promise<AgreementEntity> => {
  const { type, version } = req;

  await AgreementModel.findOneAndUpdate(
    {
      type,
      isDestroyed: false,
    },
    { isDestroyed: true }
  );

  const agreement = await AgreementModel.create({ type, version });

  return agreement;
};

export const findValidAgreements = async (): Promise<{
  termsOfUseAgreement: AgreementEntity;
  privacyPolicyAgreement: AgreementEntity;
}> => {
  const [termsOfUseAgreement, privacyPolicyAgreement] = await Promise.all(
    [AgreementType.TermsOfUse, AgreementType.PrivacyPolicy].map((type) =>
      AgreementModel.findOne({
        type,
        isDestroyed: false,
      })
    )
  );

  if (!termsOfUseAgreement) {
    throw new Error(
      `Unexpectd Error; valid agreement ${AgreementType.TermsOfUse} not found`
    );
  }

  if (!privacyPolicyAgreement) {
    throw new Error(
      `Unexpectd Error; valid agreement ${AgreementType.PrivacyPolicy} not found`
    );
  }

  return { termsOfUseAgreement, privacyPolicyAgreement };
};
