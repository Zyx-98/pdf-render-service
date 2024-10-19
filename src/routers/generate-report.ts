import { getGenerateReportController } from "@/dependency";
import { zodValidation } from "@/utils/zod-validation";
import { GenerateReportSchema } from "@/validations/generate-report";
import { Router } from "express";

const router = Router();

const generateReportController = getGenerateReportController();

router.route("/").post(zodValidation(GenerateReportSchema), generateReportController.generateReport)

export default router;