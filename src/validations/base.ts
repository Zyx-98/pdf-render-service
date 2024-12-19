import { templateType } from "@/constants/template";
import { z } from "zod";

export const baseSchema = z.object({
  templateId: z.enum(Object.keys(templateType) as [keyof typeof templateType]),
});
