import { Router } from "express";
import Zod from "@/middlewares/zod";
import { getGenerateReportController } from "@/dependency";
import { GenerateReportSchema } from "@/validations/generate-report";

const router = Router();

const generateReportController = getGenerateReportController();

router.route("/").post(Zod.validation(GenerateReportSchema), generateReportController.generateReport)

export default router;