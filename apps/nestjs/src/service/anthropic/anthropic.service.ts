import { Anthropic } from "@anthropic-ai/sdk";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AnthropicService {
  private readonly anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_SECRET_KEY!,
  });

  async summarizeText(text: string, prompt: string) {
    const response = await this.anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `${prompt}\n\n${text}`,
        },
      ],
    });

    return response.content[0]?.type ?? null;
  }

  async generateParagraph(text: string, prompt: string) {
    const response = await this.anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `${prompt}\n\n${text}`,
        },
      ],
    });

    return response.content[0]?.type ?? null;
  }

  async summarizeImageWithVision(base64Image: string, prompt: string) {
    const response = await this.anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image",
              source: {
                type: "base64",
                media_type: "image/jpeg",
                data: base64Image,
              },
            },
          ],
        },
      ],
    });

    return response.content[0]?.type ?? null;
  }

  // Placeholder transcribe logic – update this when Anthropic supports speech/audio input
  async transcribe(): Promise<string> {
    const response = await this.anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 500,
      messages: [
        {
          role: "user",
          content: "This is a placeholder for transcription. Anthropic does not support audio input directly.",
        },
      ],
    });

    return response.content[0]?.type ?? "No transcription result.";
  }
}
