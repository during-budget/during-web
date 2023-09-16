import { CustomError } from "./CustomError";

class ConflictError extends CustomError {
  constructor() {
    super();
    this.name = "ConflictError";
    this.status = 409;
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
