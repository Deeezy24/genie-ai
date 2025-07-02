import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD, APP_PIPE } from "@nestjs/core";
import { ZodValidationPipe } from "nestjs-zod";
import { ApiModule } from "./api/api.module";
import { ClerkModule } from "./clerk/clerk.module";
import { ClerkAuthGuard } from "./guard/auth/clerk-auth.guard";
import { PrismaModule } from "./prisma/prisma.module";
import { ClerkClientProvider } from "./providers/clerk/clerk-client.service";
import { PrismaClientProvider } from "./providers/prisma/prisma-client.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env", ".env.local"],
    }),
    ApiModule,
    PrismaModule,
    ClerkModule,
  ],
  providers: [
    ClerkClientProvider,
    PrismaClientProvider,
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
