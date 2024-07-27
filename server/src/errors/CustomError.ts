export class CustomError extends Error {
  constructor() {
    super();
    this.name = "Error";
  }

  protected logError(debug?: Object) {
    if (debug) {
      console.log("[ERROR]", this.message, debug);
    }
  }
}
