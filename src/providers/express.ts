import express from "express";
import "express-async-errors";
import Bootstrap from "@/middlewares/kernel";
import Locals from "./locals";
import ExceptionHandler from "@/exception/handler";
import Log from "@/utils/log";
import { ServiceContainer } from "./service-container";
import { PdfService } from "@/services/pdf";
import ImageService from "@/services/image";
import DocxStrategy from "@/services/strategies/docx";
import DocxTemplateStrategy from "@/services/strategies/docx-template";
import GenerateReportStrategy from "@/services/strategies/generate-report";
import { GenerateReportController } from "@/controllers/v1/generate-report";

class Express {
  public express: express.Application;

  constructor() {
    this.express = express();

    this.mountAppGlobal();
    this.mountDependencies();
    this.mountMiddlewares();
    this.mountConfig();
    this.mountRoutes();
  }

  private mountAppGlobal() {
    global.app = this.express as typeof globalThis.app;
    global.app.container = new ServiceContainer();
  }

  private mountDependencies() {
    app.container.bind(PdfService, () => new PdfService());
    app.container.bind(ImageService, () => new ImageService());
    app.container.bind(
      DocxStrategy,
      (container) => new DocxStrategy(container.make(PdfService))
    );
    app.container.bind(
      DocxTemplateStrategy,
      (container) =>
        new DocxTemplateStrategy(
          container.make(PdfService),
          container.make(ImageService)
        )
    );
    app.container.bind(
      GenerateReportStrategy,
      () => new GenerateReportStrategy()
    );
    app.container.bind(
      GenerateReportController,
      (container) =>
        new GenerateReportController(container.make(GenerateReportStrategy))
    );
  }

  private mountMiddlewares(): void {
    this.express = Bootstrap.init(this.express);
  }

  private async mountRoutes(): Promise<void> {
    const Routers = await import("./routers");
    this.express = Routers.default.mount(this.express);
  }

  private mountConfig(): void {
    this.express = Locals.init(this.express);
  }

  public static init(): Express {
    return new this();
  }

  public start(): any {
    const port: number = Locals.config().port;

    this.express.use(ExceptionHandler.errorHandler);

    this.express
      .listen(port, () => {
        return Log.info(`Server :: Running @ 'http://localhost:${port}'`);
      })
      .on("error", (_error) => {
        return Log.error(_error.message);
      });
  }
}

export default Express.init();
