export interface IPdfService {
  convertToPdf(inputFilePath: string): Promise<Buffer | null>;
}
