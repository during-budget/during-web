import { CustomError } from "./CustomError";

class AuthError extends CustomError {
  constructor() {
    super();
    this.name = "AuthError";
    this.status = 401;
  }
}

export class EmailRequiredError extends AuthError {
  constructor() {
    super();
    this.message = "EMAIL_REQUIRED";
  }
}

export class LocalLoginIsDisabledError extends AuthError {
  constructor() {
    super();
    this.message = "LOCAL_LOGIN_DISABLED";
  }
}

export class EmailIsInUseError extends AuthError {
  constructor() {
    super();
    this.message = "EMAIL_IN_USE";
  }
}

export class FailedToSendVerificationCodeError extends AuthError {
  constructor() {
    super();
    this.message = "INVALID_EMAIL";
  }
}

export class VerificationCodeIsExpiredError extends AuthError {
  constructor() {
    super();
    this.message = "VERIFICATION_CODE_EXPIRED";
  }
}

export class VerificationCodeIsWrongError extends AuthError {
  constructor() {
    super();
    this.message = "VERIFICATION_CODE_WRONG";
  }
}

export class SnsIdIsAlreadyConnectedError extends AuthError {
  constructor() {
    super();
    this.message = "CONNECTED_ALREADY";
  }
}

export class SnsIdIsInUseError extends AuthError {
  constructor() {
    super();
    this.message = "SNSID_IN_USE";
  }
}
