import { IConfig } from "@/interfaces/locals";
import { ServiceContainer } from "@/providers/service-container";
import { Application } from "express";

export declare global {
  declare module globalThis {
    var app: Application & {
      container: ServiceContainer;
      locals: { config: IConfig };
    };
  }
}
