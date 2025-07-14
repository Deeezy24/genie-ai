import { Module } from "@nestjs/common";
import { PrismaModule } from "@/service/prisma/prisma.module";
import { AuthModule } from "./v1/auth/auth.module";
import { ToolsModule } from "./v1/tools/tools.module";
import { UserModule } from "./v1/user/user.module";
import { WebhookModule } from "./v1/webhook/webhook.module";

@Module({
  imports: [AuthModule, WebhookModule, PrismaModule, UserModule, ToolsModule],
})
export class ApiModule {}
