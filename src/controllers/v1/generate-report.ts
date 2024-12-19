import { Request, Response } from "express";
import GenerateReportStrategy from "@/services/strategies/generate-report";
import { getDocxTemplateStrategyService } from "@/dependency";
import Locals from "@/providers/locals";
import { StatusCodes } from "http-status-codes";
import { PassThrough } from "stream";

const TEMPLATE_ITEMS = {
  1: '/simple_docx_template.docx',
  2: '/simple_docx_template-small.docx',
}

export class GenerateReportController {
  constructor(private generateReportStrategyService: GenerateReportStrategy) {}

  generateReport = async (req: Request, res: Response) => {
    const { templateId, data } = req.body;
    const templatePath =
      Locals.config().templatePath + TEMPLATE_ITEMS[templateId as keyof typeof TEMPLATE_ITEMS];

    const report = await this.generateReportStrategyService
      .setStrategy(getDocxTemplateStrategyService())
      .executeStrategy(data, templatePath);

    if (!report)
      res
        .status(StatusCodes.EXPECTATION_FAILED)
        .send({ message: "Error generating" });

    const stream = new PassThrough();

    stream.end(report);

    res.setHeader("Content-Length", report?.length?.toString() || 0);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=sample.pdf");

    stream.pipe(res);
  };
}
