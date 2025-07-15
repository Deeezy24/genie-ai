import { ConfigService } from "@nestjs/config";
import OpenAI from "openai";

export const OpenAiClientProvider = {
  provide: "OpenAiClient",
  useFactory: (configService: ConfigService) => {
    const openaiApiKey = configService.get<string>("OPENAI_SECRET_KEY");

    if (!openaiApiKey) {
      throw new Error("OPENAI_SECRET_KEY is not set");
    }

    const openai = new OpenAI({
      apiKey: openaiApiKey,
    });

    return openai;
  },
  inject: [ConfigService],
};
