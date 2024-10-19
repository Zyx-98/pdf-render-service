import { Application } from "express";
import router from "@/routers";
import Log from "@/utils/log";
import Locals from "./locals";

export default class Routers {
  public static mount(_express: Application): Application {
    const apiPrefix = Locals.config().apiPrefix;

    _express.get("/health", (req, res) => {
      res.send({
        status: "healthy",
      });
    });

    Log.info("Routes :: Mounting API Routes...");

    return _express.use(`/${apiPrefix}`, router);
  }
}
