import { z } from "zod";
import { baseSchema } from "./base";

export const GenerateReportSchema = baseSchema.extend({
  data: z.object({
    seller: z.object({
      name: z.string(),
      address: z.string(),
      tel: z.string(),
      fax: z.string(),
      email: z.string(),
    }),
    invoice: z.object({
      date: z.string(),
      number: z.string(),
      accountNo: z.string(),
    }),

    billing: z.object({
      name: z.string(),
      attn: z.string(),
      address: z.string(),
      tel: z.string(),
    }),
    delivery: z.object({
      name: z.string(),
      attn: z.string(),
      address: z.string(),
      tel: z.string(),
      date: z.string(),
    }),
    paymentItems: z.array(
      z.object({
        description: z.string(),
        quantity: z.number(),
        unitPrice: z.number(),
        total: z.number(),
      })
    ),
    url: z.string(),
    note: z.string(),
  }),
});
