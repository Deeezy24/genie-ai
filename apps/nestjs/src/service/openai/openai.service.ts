import { Injectable } from "@nestjs/common";
import { OpenAI } from "openai";
import { Readable } from "stream";

@Injectable()
export class OpenAIService {
  private readonly openai = new OpenAI({
    apiKey: process.env.OPENAI_SECRET_KEY,
  });

  async transcribe(fileStream: Readable) {
    return await this.openai.audio.transcriptions.create({
      file: fileStream as any,
      model: "whisper-1",
    });
  }

  async summarizeText(text: string, prompt: string) {
    const result = await this.openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "text", text: text },
          ],
        },
      ],
    });
    return result.choices[0]?.message.content;
  }

  async summarizeImageWithVision(base64Image: string, prompt: string) {
    const result = await this.openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: `data:image/jpeg;base64,${base64Image}` } },
          ],
        },
      ],
    });

    return result.choices[0]?.message.content;
  }
}
