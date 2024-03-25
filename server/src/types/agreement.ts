import { AgreementEntity } from "@models/Agreement";

export enum AgreementType {
  TermsOfUse = "TERMS_OF_USE",
  PrivacyPolicy = "PRIVACY_POLICY",
}

export type Agreement = {
  _id: string;
  type: AgreementType;
  version: string;
};

export function convertToAgreement(agreementEntity: AgreementEntity) {
  return {
    _id: agreementEntity._id.toString(),
    type: agreementEntity.type,
    version: agreementEntity.version,
  };
}
