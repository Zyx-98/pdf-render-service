import { DocxInputType, IGenerateReportStrategy } from "@/interfaces/report";
import fs from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { patchDocument } from "docx";
import { generateUniqueName } from "@/utils/random";
import Locals from "@/providers/locals";
import { PdfService } from "../pdf";
import Log from "@/utils/log";

export default class DocxStrategy implements IGenerateReportStrategy {
  constructor(private pdfService: PdfService) {}

  async execute(
    patches: DocxInputType,
    templatePath: string
  ): Promise<Buffer | null> {
    const newDocFile = path.join(
      Locals.config().outputPath,
      `${generateUniqueName()}.docx`
    );

    try {
      const templateData = await fs.readFile(templatePath);

      const report = await patchDocument({
        outputType: "nodebuffer",
        data: templateData,
        patches,
      });

      await fs.writeFile(newDocFile, report);

      const pdfBuffer = await this.pdfService.fetchPdfFile(newDocFile);

      return pdfBuffer;
    } catch (error: any) {
      Log.error(`DocxStrategy execution failed: ${error.message}`);
      throw error;
    } finally {
      this.cleanupFile(newDocFile);
    }
  }

  private async cleanupFile(filePath: string): Promise<void> {
    try {
      if (existsSync(filePath)) {
        await fs.unlink(filePath);
      }
    } catch (error: any) {
      Log.error(`Failed to cleanup file ${filePath}: ${error.message}`);
    }
  }
}
