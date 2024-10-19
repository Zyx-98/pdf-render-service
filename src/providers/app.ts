import Log from "@/utils/log";
import Express from "./express";

class App {
  public static init() {
    return new this();
  }

  public loadServer(): void {
    Log.info("Server :: Booting @ Master...");

    Express.start();
  }
}

export default App.init();
