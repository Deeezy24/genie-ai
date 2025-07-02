import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ClerkClientProvider } from "@/providers/clerk/clerk-client.service";

@Global()
@Module({
  imports: [ConfigModule],
  providers: [ClerkClientProvider],
  exports: [ClerkClientProvider],
})
export class ClerkModule {}
