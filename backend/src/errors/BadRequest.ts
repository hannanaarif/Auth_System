import BaseError from "./BaseError";


class BadRequest extends BaseError {
  constructor(message: string, details: string = "Bad request") {
    super(message, 400, details);
    this.name = "BadRequest";
  }
}

export default BadRequest;

