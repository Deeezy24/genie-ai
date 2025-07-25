import { Module } from "@nestjs/common";
import { PrismaModule } from "@/service/prisma/prisma.module";
import { AuthModule } from "./v1/auth/auth.module";
import { BillingModule } from "./v1/billing/billing.module";
import { ChatModule } from "./v1/chat/chat.module";
import { CheckoutModule } from "./v1/checkout/checkout.module";
import { NotificationModule } from "./v1/notification/notification.module";
import { ToolsModule } from "./v1/tools/tools.module";
import { UserModule } from "./v1/user/user.module";
import { WebhookModule } from "./v1/webhook/webhook.module";

@Module({
  imports: [
    AuthModule,
    WebhookModule,
    PrismaModule,
    UserModule,
    ToolsModule,
    CheckoutModule,
    BillingModule,
    NotificationModule,
    ChatModule,
  ],
})
export class ApiModule {}
