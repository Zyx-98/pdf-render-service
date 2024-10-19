export default class Log {
  private static logMessage(
    level: string,
    message: string,
    colorCode: string
  ): void {
    message.split("\n").forEach((line) => {
      console.log(`\x1b[${colorCode}m%s\x1b[0m`, `[${level}] :: ${line}`);
    });
  }

  public static info(message: string): void {
    this.logMessage("INFO", message, "34");
  }

  public static warn(message: string): void {
    this.logMessage("WARN", message, "33");
  }

  public static error(message: string): void {
    this.logMessage("ERROR", message, "31");
  }
}
