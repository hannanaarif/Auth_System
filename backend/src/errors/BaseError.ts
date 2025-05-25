

class BaseError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public details: string = ''
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default BaseError;
