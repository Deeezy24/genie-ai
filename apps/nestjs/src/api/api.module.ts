import { Module } from "@nestjs/common";
import { PrismaModule } from "@/prisma/prisma.module";
import { AuthModule } from "./v1/auth/auth.module";
import { WebhookModule } from "./v1/webhook/webhook.module";

@Module({
  imports: [AuthModule, WebhookModule, PrismaModule],
})
export class ApiModule {}
