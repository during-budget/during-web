import { CustomError } from "./CustomError";

export class ConflictError extends CustomError {
  constructor(message?: string) {
    super();
    this.name = "ConflictError";
    this.status = 409;

    if (message) {
      this.message = message;
    }
  }
}

export class IsCurrentCannotBeUpdatedError extends ConflictError {
  constructor() {
    super();
    this.message = "ISCURRENT_CANNOT_BE_UPDATED";
  }
}

export class DefaultCategoryCannotBeUpdatedError extends ConflictError {
  constructor() {
    super();
    this.message = "DEFAULT_CATEGORY_CANNOT_BE_UPDATED";
  }
}

export class AtLeastOneSnsIdIsRequiredError extends ConflictError {
  constructor() {
    super();
    this.message = "AT_LEAST_ONE_SNSID_IS_REQUIRED";
  }
}

export class InvalidInAppProductPurchaseStateError extends ConflictError {
  constructor() {
    super("INVALID_IN_APP_PRODUCT_PURCHASE_STATE");
  }
}
