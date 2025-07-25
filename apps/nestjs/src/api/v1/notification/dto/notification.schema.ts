import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const createNotificationSchema = z.object({
  notification_message: z.string().min(1),
  notification_subject: z.string().min(1),
  notification_type: z.string().min(1),
  notification_cta: z.string().url().optional(),
});

const getAllNotificationsSchema = z.object({
  page: z.coerce.number().min(1),
  limit: z.coerce.number().min(1),
});

const markAsReadSchema = z.object({
  id: z.string().min(1),
});

export type CreateNotificationSchema = z.infer<typeof createNotificationSchema>;
export type getAllNotificationsSchema = z.infer<typeof getAllNotificationsSchema>;
export type markAsReadSchema = z.infer<typeof markAsReadSchema>;

export class CreateNotificationDto extends createZodDto(createNotificationSchema) {}
export class GetAllNotificationsDto extends createZodDto(getAllNotificationsSchema) {}
export class MarkAsReadDto extends createZodDto(markAsReadSchema) {}
