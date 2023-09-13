import { CustomError } from "./CustomError";

class ForbiddenError extends CustomError {
  constructor() {
    super();
    this.name = "ForbiddenError";
    this.status = 403;
  }
}

export class NotPermittedError extends ForbiddenError {
  constructor() {
    super();
    this.message = "NOT_PERMITTED";
  }
}
