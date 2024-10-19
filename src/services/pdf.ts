import path from "path";
import { exec } from "child_process";
import fs from "fs";
import { generateUniqueName } from "@/utils/random";
import { IPdfService } from "@/interfaces/pdf";
import Locals from "@/providers/locals";
import Log from "@/utils/log";

export class PdfService implements IPdfService {
  async convertToPdf(inputFilePath: string): Promise<Buffer | null> {
    const { outputPath } = Locals.config();
    const outputDirectory = outputPath + "/" + generateUniqueName();

    return new Promise((resolve, reject) => {
      const libreofficeProcessId = generateUniqueName();
      /** TODO: Configure the UserInstallation path using an environment variable to ensure unique temp directories for each LibreOffice process.
       * It is necessary to reconsider and improve the handling of concurrency in the API
       */
      const command = `soffice -env:UserInstallation=file:///tmp/libreoffice/${libreofficeProcessId} --headless --convert-to pdf "${inputFilePath}" --outdir "${outputDirectory}"`;

      const child = exec(
        command,
        { timeout: 10000, maxBuffer: 20 * 1024 },
        (error, stdout, stderr) => {
          if (error) {
            Log.error(`Conversion failed with error: ${error.message}`);
            child.kill();
            reject(stderr);
          } else {
            const files = fs.readdirSync(outputDirectory);
            let result = null;
            for (const file of files) {
              if (path.extname(file) === ".pdf") {
                result = fs.readFileSync(`${outputDirectory}/${file}`);
                break;
              }
            }

            try {
              // WARNING: CAREFUL
              fs.rmSync(outputDirectory, {
                recursive: true,
                force: true,
              });

              fs.rmSync(`/tmp/libreoffice/${libreofficeProcessId}`, {
                recursive: true,
                force: true,
              });
            } catch (error: any) {
              Log.error(error.message);
            }

            resolve(result);
          }
        }
      );
    });
  }
}

// async function convertToPdf(inputFilePath: string): Promise<Buffer | null> {
//   const { outputPath } = Locals.config();
//   const outputDirectory = outputPath + "/" + generateUniqueName();

//   const maxRetries = 5;

//   const executeCommandWithRetry = async (
//     retries: number
//   ): Promise<Buffer | null> => {
//     return new Promise((resolve, reject) => {
//       const command = `soffice --headless --convert-to pdf "${inputFilePath}" --outdir "${outputDirectory}"`;

//       exec(command, (error, stdout, stderr) => {
//         if (error) {
//           Log.error(`Conversion failed with error: ${error.message}`);

//           if (retries > 0) {
//             Log.info(`Retrying... Attempts left: ${retries}`);
//             resolve(executeCommandWithRetry(retries - 1));
//           } else {
//             Log.error("Max retry attempts reached.");
//             reject(stderr);
//           }
//         } else {
//           const files = fs.readdirSync(outputDirectory);
//           for (const file of files) {
//             if (path.extname(file) === ".pdf") {
//               try {
//                 const fileContent = fs.readFileSync(
//                   `${outputDirectory}/${file}`
//                 );
//                 fs.rmSync(outputDirectory, { recursive: true, force: true });
//                 resolve(fileContent);
//                 return;
//               } catch (error) {
//                 reject(error);
//               }
//             }
//           }
//           resolve(null);
//         }
//       });
//     });
//   };

//   return executeCommandWithRetry(maxRetries);
// }
