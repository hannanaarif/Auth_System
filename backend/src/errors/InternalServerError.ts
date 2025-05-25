import BaseError from "./BaseError";


class InternalServerError extends BaseError {
    constructor(message: string, details: string = "Internal server error") {
        super(message, 500, details);
        this.name = "InternalServerError";
    }

}

export default InternalServerError;