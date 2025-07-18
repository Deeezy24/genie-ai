import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD, APP_PIPE } from "@nestjs/core";
import { ZodValidationPipe } from "nestjs-zod";
import { ApiModule } from "./api/api.module";
import { ClerkAuthGuard } from "./guard/auth/clerk-auth.guard";
import { ClerkClientProvider } from "./providers/clerk/clerk-client.service";
import { AnthropicModule } from "./service/anthropic/anthropic.module";
import { ClerkModule } from "./service/clerk/clerk.module";
import { OpenAiModule } from "./service/openai/openai.module";
import { PrismaModule } from "./service/prisma/prisma.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env", ".env.local"],
    }),
    ApiModule,
    PrismaModule,
    ClerkModule,
    OpenAiModule,
    AnthropicModule,
    PrismaModule,
  ],
  providers: [
    ClerkClientProvider,
    {
      provide: APP_GUARD,
      useClass: ClerkAuthGuard,
    },

    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
})
export class AppModule {}
