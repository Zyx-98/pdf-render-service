import { DocxInputType, IGenerateReportStrategy } from "@/interfaces/report";
import fs from "fs";
import { patchDocument } from "docx";
import { generateUniqueName } from "@/utils/random";
import Locals from "@/providers/locals";
import { PdfService } from "../pdf";

export default class DocxStrategy implements IGenerateReportStrategy {
  constructor(private pdfService: PdfService) {}

  async execute(
    patches: DocxInputType,
    templatePath: string
  ): Promise<Buffer | null> {
    const newDocFile =
      Locals.config().outputPath + "/" + generateUniqueName() + ".docx";

    try {
      const report = await patchDocument({
        outputType: "nodebuffer",
        data: fs.readFileSync(templatePath),
        patches,
      });

      fs.writeFileSync(newDocFile, report);

      const pdfFilePath = await this.pdfService.fetchPdfFile(newDocFile);

      return pdfFilePath;
    } catch (error) {
      throw error;
    } finally {
      if (fs.existsSync(newDocFile)) fs.unlinkSync(newDocFile);
    }
  }
}
