import path from "path";
import { exec } from "child_process";
import fs from "fs";
import { generateUniqueName } from "@/utils/random";
import Locals from "@/providers/locals";
import Log from "@/utils/log";

const checkInterval = 500;
const timeoutDuration = 30000;

const instanceStatus = Array.from(
  { length: Locals.config().numInstances },
  (_, i) => [`p${i + 1}`, 0]
);

export class PdfService {
  private async convertFileToPdf(
    inputFilePath: string,
    instanceName: string
  ): Promise<Buffer | null> {
    const { outputPath } = Locals.config();
    const outputDirectory = `${outputPath}/${generateUniqueName()}`;

    return new Promise((resolve, reject) => {
      /** TODO: Configure the UserInstallation path using an environment variable to ensure unique temp directories for each LibreOffice process.
       * It is necessary to reconsider and improve the handling of concurrency in the API
       */
      const command = `soffice -env:UserInstallation=file:///tmp/libreoffice/${instanceName} --headless --convert-to pdf "${inputFilePath}" --outdir "${outputDirectory}"`;

      const childProcess = exec(
        command,
        { timeout: 10000, maxBuffer: 20 * 1024 },
        (error, stdout, stderr) => {
          childProcess.kill();
          if (error) {
            Log.error(`Conversion failed with error: ${error.message}`);
            reject(stderr);
          } else {
            const outputFiles = fs.readdirSync(outputDirectory);
            let pdfBuffer: Buffer | null = null;

            for (const file of outputFiles) {
              if (path.extname(file) === ".pdf") {
                pdfBuffer = fs.readFileSync(`${outputDirectory}/${file}`);
                break;
              }
            }

            try {
              // WARNING: CAREFUL
              fs.rmSync(outputDirectory, {
                recursive: true,
                force: true,
              });
            } catch (error: any) {
              Log.error(error.message);
            }

            resolve(pdfBuffer);
          }
        }
      );
    });
  }

  async fetchPdfFile(inputFilePath: string): Promise<Buffer | null> {
    return new Promise((resolve, reject) => {
      let elapsedTime = 0;
      let pdfBuffer: Buffer | null = null;

      const intervalId = setInterval(async () => {
        for (let status of instanceStatus) {
          const [instanceName, isProcessing] = status;

          if (!isProcessing) {
            clearInterval(intervalId);
            status[1] = 1; // Mark instance as processing

            try {
              pdfBuffer = await this.convertFileToPdf(inputFilePath, instanceName as string);
            } catch (error) {
              reject(error);
            }

            status[1] = 0; // Mark instance as free
            resolve(pdfBuffer);
            return;
          }
        }

        elapsedTime += checkInterval;

        if (elapsedTime >= timeoutDuration) {
          clearInterval(intervalId);
          resolve(pdfBuffer);
        }
      }, checkInterval);
    });
  }
}
