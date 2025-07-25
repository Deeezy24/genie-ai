import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const createChatSchema = z.object({
  message: z.string(),
  modelId: z.string().uuid(),
  chatId: z.string().optional(),
});

const getAllChatsSchema = z.object({
  page: z.coerce.number(),
  limit: z.coerce.number(),
  chatId: z.string().uuid().optional(),
});

export type CreateChatSchema = z.infer<typeof createChatSchema>;
export type getAllChatsSchema = z.infer<typeof getAllChatsSchema>;

export class CreateChatDto extends createZodDto(createChatSchema) {}
export class GetChatsDto extends createZodDto(getAllChatsSchema) {}
