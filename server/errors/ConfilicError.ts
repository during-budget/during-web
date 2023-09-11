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
