import path from "path";
import crypto from "crypto";
import { IConfig } from "@/interfaces/locals";
import { Application } from "express";

export default class Locals {
  public static config(): IConfig {
    return {
      port: +(process.env.PORT || "") || 3000,
      templatePath:
        process.env.TEMPLATE_PATH ||
        path.resolve(__dirname, "../../storage/template"),
      apiPrefix: process.env.API_PREFIX || "api",
      outputPath:
        process.env.OUTPUT_PATH ||
        path.resolve(__dirname, "../../storage/output"),
      numInstances: +(process.env.NUM_INSTANCES || 0) || 1,
      basicAuthUser:
        process.env.BASIC_AUTH_USER ||
        crypto.randomBytes(4).toString("hex").slice(0, 8),
      basicAuthPassword:
        process.env.BASIC_AUTH_PASSWORD ||
        crypto.randomBytes(4).toString("hex").slice(0, 20),
    };
  }

  public static init(_express: Application): Application {
    _express.locals.config = this.config();
    return _express;
  }
}
