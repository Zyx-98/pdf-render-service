import { DocxInputType, IGenerateReportStrategy } from "@/interfaces/report";

export default class GenerateReportStrategy {
    private strategy!: IGenerateReportStrategy

    public setStrategy(strategy: IGenerateReportStrategy) {
        this.strategy = strategy;
        return this;
    }

    public executeStrategy(data: Object | DocxInputType, templatePath: string, ...args: any[]) {
        if(!this.strategy) {
            throw new Error("No report strategy set");
        }

        const buffer = this.strategy.execute(data, templatePath, ...args);

        return buffer
    }
}