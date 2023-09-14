import { CustomError } from "./CustomError";

class PaymentError extends CustomError {
  constructor() {
    super();
    this.name = "PaymentError";
    this.status = 409;
  }
}

export class PaiedAlreadyError extends PaymentError {
  constructor() {
    super();
    this.message = "PAIED_ALREADY";
    this.status = 409;
  }
}

export class FetchingAccessTokenFailedError extends PaymentError {
  constructor() {
    super();
    this.message = "FETCHING_ACCESSTOKEN_FAILED";
    this.status = 401;
  }
}

export class FetchingPaymentFailedError extends PaymentError {
  constructor() {
    super();
    this.message = "IMP_UID_INVALID";
    this.status = 404;
  }
}

export class PaymentIsNotPaidError extends PaymentError {
  constructor() {
    super();
    this.message = "PAYMENT_NOT_PAID";
    this.status = 409;
  }
}

export class FakePaymentAttemptError extends PaymentError {
  constructor() {
    super();
    this.message = "FAKE_PAYMENT_ATTEMPT";
    this.status = 409;
  }
}
