import { GenerateReportController } from "@/controllers/v1/generate-report"
import ImageService from "@/services/image"
import { PdfService } from "@/services/pdf"
import DocxStrategy from "@/services/strategies/docx"
import DocxTemplateStrategy from "@/services/strategies/docx-template"
import GenerateReportStrategy from "@/services/strategies/generate-report"

export function getPdfService() {
    return new PdfService()
}

export function getImageService() {
    return new ImageService()
}

export function getDocxStrategyService() {
    return new DocxStrategy(getPdfService())
}

export function getDocxTemplateStrategyService() {
    return new DocxTemplateStrategy(getPdfService(), getImageService())
}

export function getGenerateReportStrategyService() {
    return new GenerateReportStrategy()
}

export function getGenerateReportController() {
    return new GenerateReportController(getGenerateReportStrategyService())
}