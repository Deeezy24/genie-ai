import { BadRequestException, Body, Controller, Post } from "@nestjs/common";
import { Public } from "@/decorator/public/public.decorator";
import type { UserCreatedWebhook } from "./dto/webhook.schema";
import { WebhookService } from "./webhook.service";

@Controller("webhook")
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}
  @Public()
  @Post("/user-created")
  createUserWebhook(@Body() userCreatedWebhook: UserCreatedWebhook) {
    try {
      return this.webhookService.createUserWebhook(userCreatedWebhook);
    } catch (error) {
      throw new BadRequestException("Failed to create user webhook");
    }
  }
}
