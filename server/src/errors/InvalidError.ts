import { CustomError } from "./CustomError";

export class InvalidError extends CustomError {
  constructor(message?: string) {
    super();
    this.name = "InvalidError";
    this.status = 400;
    this.message = message || "Invalid Request";
  }
}

export class FieldRequiredError extends InvalidError {
  constructor(field: string) {
    super();
    this.name = "FieldRequiredError";
    this.message = field.toUpperCase() + "_REQUIRED";
  }
}

export class FieldInvalidError extends InvalidError {
  constructor(field: string) {
    super();
    this.name = "FieldInvalidError";
    this.message = field.toUpperCase() + "_INVALID";
  }
}
