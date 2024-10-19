import { IPatch } from "docx";

export interface IGenerateReportStrategy {
  execute(data: Object | DocxInputType, templatePath: string, ...args: any[]): Promise<Buffer | null>;
}


export type DocxInputType = { [key: string]: IPatch }