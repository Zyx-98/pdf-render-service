import { IConfig } from "@/interfaces/locals";
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
    };
  }

  public static init(_express: Application): Application {
    _express.locals.app = this.config();
    return _express;
  }
}
