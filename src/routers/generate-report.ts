import { Router } from "express";
import Zod from "@/middlewares/zod";
import { getGenerateReportController } from "@/dependency";

const router = Router();

const generateReportController = getGenerateReportController();

router.route("/").post(Zod.pdfValidation(), generateReportController.generateReport)

export default router;