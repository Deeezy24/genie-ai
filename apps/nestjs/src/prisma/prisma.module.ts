import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaClientProvider } from "../providers/prisma/prisma-client.service";

@Global()
@Module({
  imports: [ConfigModule],
  providers: [PrismaClientProvider],
  exports: [PrismaClientProvider],
})
export class PrismaModule {}
