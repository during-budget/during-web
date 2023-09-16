export class CustomError extends Error {
  constructor() {
    super();
    this.name = "Error";
  }
}
