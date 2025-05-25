import BaseError from "./BaseError";


class NotFoundError extends BaseError {
  constructor(message: string, details: string = "Resource not found") {
    super(message, 404, details);
    this.name = "NotFoundError";
  }
}

export default NotFoundError;