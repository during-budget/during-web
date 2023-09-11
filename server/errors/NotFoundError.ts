import { CustomError } from "./CustomError";

class NotFoundError extends CustomError {
  constructor() {
    super();
    this.name = "NotFoundError";
    this.status = 404;
  }
}

export class UserNotFoundError extends NotFoundError {
  constructor() {
    super();
    this.message = "USER_NOT_FOUND";
  }
}

export class BudgetNotFoundError extends NotFoundError {
  constructor() {
    super();
    this.message = "BUDGET_NOT_FOUND";
  }
}

export class CategoryNotFoundError extends NotFoundError {
  constructor() {
    super();
    this.message = "CATEGORY_NOT_FOUND";
  }
}

export class PaymentMethodNotFoundError extends NotFoundError {
  constructor() {
    super();
    this.message = "PAYMENTMETHOD_NOT_FOUND";
  }
}

export class TransactionNotFoundError extends NotFoundError {
  constructor() {
    super();
    this.message = "TRANSACTION_NOT_FOUND";
  }
}
