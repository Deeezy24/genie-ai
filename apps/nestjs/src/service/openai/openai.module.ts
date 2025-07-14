import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { OpenAiClientProvider } from "@/providers/openai/openai-client.service";

@Global()
@Module({
  imports: [ConfigModule],
  providers: [OpenAiClientProvider],
  exports: [OpenAiClientProvider],
})
export class ClerkModule {}
