import { GenerateReportSchema } from "@/validations/generate-report";

export const templateType = {
  sample: "sample",
  "sample-small": "sample-small",
};

export const templates = {
  [templateType.sample]: {
    path: "/simple_docx_template.docx",
    validationSchema: GenerateReportSchema,
  },
  [templateType["sample-small"]]: {
    path: "/simple_docx_template-small.docx",
    validationSchema: GenerateReportSchema,
  },
};
