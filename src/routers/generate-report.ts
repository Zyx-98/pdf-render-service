import { Router } from "express";
import Zod from "@/middlewares/zod";
import { GenerateReportController } from "@/controllers/v1/generate-report";
import BasicAuth from "@/middlewares/basic-auth";

const router = Router();

router
  .route("/")
  .post(
    BasicAuth.middleware,
    Zod.pdfValidation(),
    app.container.make<GenerateReportController>(GenerateReportController)
      .generateReport
  );

export default router;