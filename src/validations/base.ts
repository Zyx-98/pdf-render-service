import { TEMPLATE_TYPE } from "@/constants/template-type";
import { z } from "zod";

export const baseSchema = z.object({
  templateId: z.enum(Object.keys(TEMPLATE_TYPE) as [keyof typeof TEMPLATE_TYPE]),
});
