import { IConfig } from "@/interfaces/locals";
import Log from "@/utils/log";
import { Application } from "express";
import path from "path";

export default class Locals {
  public static config(): IConfig {
    return {
      port: +(process.env.PORT || '') || 3000,
      templatePath:
        process.env.TEMPLATE_PATH || path.resolve(__dirname, "../../storage/template"),
      apiPrefix: process.env.API_PREFIX || "api",
      outputPath: process.env.OUTPUT_PATH || path.resolve(__dirname, "../../storage/output"),
      numInstances: +(process.env.NUM_INSTANCES || 0) || 1
    };
  }

  public static init(_express: Application): Application {
    _express.locals.config = this.config();
    _express.locals.log = Log;
    return _express;
  }
}
