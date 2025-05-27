import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { z } from "zod";
import BaseError from "../errors/BaseError";
import { INTERNAL_SERVER_ERROR } from "../constants/http";
import { clearAuthCookies } from "../utils/cookies";

const errorHandler: ErrorRequestHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(`PATH: ${req.path}`, err);

  if(req.path=="/auth/refresh"){
    clearAuthCookies(res);
  }


  if (err instanceof z.ZodError) {
    res.status(400).json({
      errors: err.issues.map((issue) => ({
        field: issue.path[0],
        message: issue.message,
      })),
    });
    return;
  }

  if (err instanceof BaseError) {
    res.status(err.statusCode).json({
      message: err.message,
      statusCode: err.statusCode,
      error: err.details || "An error occurred",
    });
    return;
  }

  res.status(INTERNAL_SERVER_ERROR).json({
    message: "Internal Server Error",
    error: err.message,
  });

};

export default errorHandler;
