import { Router } from "express";
import Zod from "@/middlewares/zod";
import { GenerateReportController } from "@/controllers/v1/generate-report";

const router = Router();

router
  .route("/")
  .post(
    Zod.pdfValidation(),
    app.container.make<GenerateReportController>(GenerateReportController)
      .generateReport
  );

export default router;