// prisma-client.provider.ts
import { ConfigService } from "@nestjs/config";
import { PrismaClient } from "@prisma/client";

export const PrismaClientProvider = {
  provide: "PrismaClient",
  useFactory: (configService: ConfigService) => {
    const databaseUrl = configService.get<string>("DATABASE_URL");

    if (!databaseUrl) {
      throw new Error("DATABASE_URL is not set");
    }

    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
    });

    prisma.$connect();
    return prisma;
  },
  inject: [ConfigService],
};
