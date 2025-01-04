import { GenerateReportSchema } from "@/validations/generate-report";
import { TEMPLATE_TYPE } from "@/constants/template-type";

export const TEMPLATES = {
  [TEMPLATE_TYPE.sample]: {
    path: "/simple_docx_template.docx",
    validationSchema: GenerateReportSchema,
  },
  [TEMPLATE_TYPE["sample-small"]]: {
    path: "/simple_docx_template-small.docx",
    validationSchema: GenerateReportSchema,
  },
};
