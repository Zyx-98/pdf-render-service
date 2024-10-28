import { z } from "zod";

export const baseSchema = z.object({
    templateId: z.number()
})