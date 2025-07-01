import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { ApiModule } from "./api/api.module";
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
  ],
  providers: [
    ClerkClientProvider,
    PrismaClientProvider,
    {
      provide: APP_GUARD,
      useClass: ClerkAuthGuard,
    },
  ],
})
export class AppModule {}
