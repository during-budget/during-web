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

export class AlreadyLoggedInError extends ForbiddenError {
  constructor() {
    super();
    this.message = "ALREADY_LOGGED_IN";
  }
}

export class NotLoggedInError extends ForbiddenError {
  constructor() {
    super();
    this.message = "NOT_LOGGED_IN";
  }
}
