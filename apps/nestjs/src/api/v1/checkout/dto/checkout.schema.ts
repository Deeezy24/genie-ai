import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const createCheckoutSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  variantId: z.string(),
  productName: z.string(),
  planId: z.string(),
  storeId: z.string(),
});

export class CreateCheckoutDto extends createZodDto(createCheckoutSchema) {}
