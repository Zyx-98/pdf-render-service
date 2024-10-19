import fs from "fs";
import path from "path";
import createReport from "docx-templates";
import Locals from "@/providers/locals";
import { generateUniqueName } from "@/utils/random";
import { IPdfService } from "@/interfaces/pdf";
import { PdfService } from "@/services/pdf";
import { IGenerateReportStrategy } from "@/interfaces/report";
import ImageService from "@/services/image";

export default class DocxTemplateStrategy implements IGenerateReportStrategy {
  private additionalJsContext: object;
  private cmdDelimiter: string | [string, string] | undefined;

  constructor(
    private pdfService: IPdfService,
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

    this.pdfService = new PdfService();
  }

  public async execute(
    data: Object,
    templatePath: string,
    additionalJsContext: Object = {}
  ): Promise<Buffer | null> {
    const newDocFile =
      Locals.config().outputPath + "/" + generateUniqueName() + ".docx";

    try {
      const report = await createReport({
        template: fs.readFileSync(templatePath),
        data,
        cmdDelimiter: this.cmdDelimiter,
        additionalJsContext: {
          ...additionalJsContext,
          ...this.additionalJsContext,
        },
      });

      fs.writeFileSync(newDocFile, report);

      const pdf = await this.pdfService.convertToPdf(newDocFile);

      return pdf;
    } catch (error) {
      throw error;
    } finally {
      if (fs.existsSync(newDocFile)) fs.unlinkSync(newDocFile);
    }
  }
}
