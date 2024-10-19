import Log from "@/utils/log";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export default class Handler {
  public static errorHandler(
    error: any,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    Log.error(`${error.toString()}\n${error.stack}`);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ errors: [{ message: "Something went wrong" }] });
  }
}
