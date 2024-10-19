import { Application } from "express";
import Log from "@/utils/log";
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";

export default class Http {
  public static mount(_express: Application): Application {
    Log.info("Booting the 'HTTP' middleware...");

    _express.use(bodyParser.json());

    _express.use(express.urlencoded({ extended: true }));

    const options: cors.CorsOptions = {
      allowedHeaders: [
        "Origin",
        "X-Requested-With",
        "Content-Type",
        "Accept",
        "X-Access-Token",
      ],
      credentials: true,
      methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
      origin: "*",
      preflightContinue: false,
    };

    _express.use(cors(options));

    return _express;
  }
}
