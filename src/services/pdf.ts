import path from "path";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import { existsSync } from "fs";
import { generateUniqueName } from "@/utils/random";
import Locals from "@/providers/locals";
import Log from "@/utils/log";

const execAsync = promisify(exec);

interface QueueItem {
  inputFilePath: string;
  resolve: (value: Buffer | null) => void;
  reject: (reason: any) => void;
}

export class PdfService {
  private queue: QueueItem[] = [];
  private availableInstances: Set<string>;
  private processing = false;
  private readonly conversionTimeout = 10000;
  private readonly maxBuffer = 10 * 1024 * 1024; // 10MB

  constructor() {
    const numInstances = Locals.config().numInstances;
    this.availableInstances = new Set(
      Array.from({ length: numInstances }, (_, i) => `p${i + 1}`)
    );
    Log.info(
      `Initialized PDF service with ${numInstances} LibreOffice instances`
    );
  }

  private async convertFileToPdf(
    inputFilePath: string,
    instanceName: string
  ): Promise<Buffer | null> {
    const { outputPath } = Locals.config();
    const outputDirectory = path.join(outputPath, generateUniqueName());

    try {
      await fs.mkdir(outputDirectory, { recursive: true });

      const command = `soffice -env:UserInstallation=file:///tmp/libreoffice/${instanceName} --headless --convert-to pdf "${inputFilePath}" --outdir "${outputDirectory}"`;

      await execAsync(command, {
        timeout: this.conversionTimeout,
        maxBuffer: this.maxBuffer,
      });

      const outputFiles = await fs.readdir(outputDirectory);
      const pdfFile = outputFiles.find((file) => path.extname(file) === ".pdf");

      if (!pdfFile) {
        Log.warn(`No PDF generated for ${inputFilePath}`);
        return null;
      }

      const pdfBuffer = await fs.readFile(path.join(outputDirectory, pdfFile));

      this.cleanupDirectory(outputDirectory).catch((err) =>
        Log.error(
          `Failed to cleanup directory ${outputDirectory}: ${err.message}`
        )
      );

      return pdfBuffer;
    } catch (error: any) {
      Log.error(`Conversion failed for ${inputFilePath}: ${error.message}`);

      this.cleanupDirectory(outputDirectory).catch(() => {});

      throw error;
    }
  }

  private async cleanupDirectory(directory: string): Promise<void> {
    try {
      if (existsSync(directory)) {
        await fs.rm(directory, { recursive: true, force: true });
      }
    } catch (error: any) {
      Log.error(`Cleanup error for ${directory}: ${error.message}`);
    }
  }

  private async processQueue(): Promise<void> {
    if (
      this.processing ||
      this.queue.length === 0 ||
      this.availableInstances.size === 0
    ) {
      return;
    }

    this.processing = true;

    while (this.queue.length > 0 && this.availableInstances.size > 0) {
      const instanceName = Array.from(this.availableInstances)[0];
      this.availableInstances.delete(instanceName);

      const item = this.queue.shift();
      if (!item) break;

      this.processConversion(item, instanceName);
    }

    this.processing = false;
  }

  /**
   * Process a single conversion and release the instance when done
   */
  private async processConversion(
    item: QueueItem,
    instanceName: string
  ): Promise<void> {
    try {
      const pdfBuffer = await this.convertFileToPdf(
        item.inputFilePath,
        instanceName
      );
      item.resolve(pdfBuffer);
    } catch (error) {
      item.reject(error);
    } finally {
      this.availableInstances.add(instanceName);

      this.processQueue();
    }
  }

  async fetchPdfFile(inputFilePath: string): Promise<Buffer | null> {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        const index = this.queue.findIndex((item) => item.resolve === resolve);
        if (index !== -1) {
          this.queue.splice(index, 1);
          reject(new Error("PDF conversion request timed out in queue"));
        }
      }, 30000);

      this.queue.push({
        inputFilePath,
        resolve: (value) => {
          clearTimeout(timeoutId);
          resolve(value);
        },
        reject: (reason) => {
          clearTimeout(timeoutId);
          reject(reason);
        },
      });

      this.processQueue();
    });
  }

  getStatus() {
    return {
      queueLength: this.queue.length,
      availableInstances: this.availableInstances.size,
      totalInstances: Locals.config().numInstances,
    };
  }
}
