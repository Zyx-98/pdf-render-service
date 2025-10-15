import fs from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import createReport from "docx-templates";
import Locals from "@/providers/locals";
import { generateUniqueName } from "@/utils/random";
import { PdfService } from "@/services/pdf";
import { IGenerateReportStrategy } from "@/interfaces/report";
import ImageService from "@/services/image";
import Log from "@/utils/log";

export default class DocxTemplateStrategy implements IGenerateReportStrategy {
  private additionalJsContext: object;
  private cmdDelimiter: string | [string, string] | undefined;

  constructor(
    private pdfService: PdfService,
    private imageService: ImageService
  ) {
    this.additionalJsContext = {
      insertImage: async (url: string) => {
        const image = await imageService.getImageFromUrl(url);
        const { widthCM: width, heightCM: height } =
          await imageService.getImageDimensionsInCM(Buffer.from(image));

        return {
          width,
          height,
          data: image,
          extension: path.extname(url),
        };
      },
    };
    this.cmdDelimiter = ["{", "}"];
  }

  public async execute(
    data: Object,
    templatePath: string,
    additionalJsContext: Object = {}
  ): Promise<Buffer | null> {
    const newDocFile = path.join(
      Locals.config().outputPath,
      `${generateUniqueName()}.docx`
    );

    try {
      const template = await fs.readFile(templatePath);

      const report = await createReport({
        template,
        data,
        cmdDelimiter: this.cmdDelimiter,
        additionalJsContext: {
          ...additionalJsContext,
          ...this.additionalJsContext,
        },
      });

      await fs.writeFile(newDocFile, report);

      const pdf = await this.pdfService.fetchPdfFile(newDocFile);

      return pdf;
    } catch (error: any) {
      Log.error(`DocxTemplateStrategy execution failed: ${error.message}`);
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
