import { NextFunction, Request, Response } from "express";

export default class BasicAuth {
  public static middleware(req: Request, res: Response, next: NextFunction) {
    const authorization = req.headers.authorization;

    if (!authorization) {
      let err = new Error("You are not authenticated!");
      res.setHeader("WWW-Authenticate", "Basic");
      res.statusCode = 401;
      return next(err);
    }

    const auth = Buffer.from(authorization.split(" ")[1], "base64")
      .toString()
      .split(":");
    const user = auth[0];
    const password = auth[1];

    if (user == app.locals.config.basicAuthUser && password == app.locals.config.basicAuthPassword) {
      next();
    } else {
      let err = new Error("You are not authenticated!");
      res.setHeader("WWW-Authenticate", "Basic");
      res.statusCode = 401;
      return next(err);
    }
  }
}
