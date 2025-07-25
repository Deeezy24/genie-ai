import { Module } from "@nestjs/common";
import { NotificationService } from "../notification/notification.service";
import { WebhookController } from "./webhook.controller";
import { WebhookService } from "./webhook.service";

@Module({
  controllers: [WebhookController],
  providers: [WebhookService, NotificationService],
  exports: [WebhookService],
})
export class WebhookModule {}
