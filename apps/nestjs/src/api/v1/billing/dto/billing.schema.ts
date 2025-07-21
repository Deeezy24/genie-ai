import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const GetBillingSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).default(10),
});

export type GetBillingSchema = z.infer<typeof GetBillingSchema>;

export class GetBillingDto extends createZodDto(GetBillingSchema) {}
