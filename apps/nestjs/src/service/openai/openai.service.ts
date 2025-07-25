import { Blob } from "node:buffer";
import { Readable } from "node:stream";
import { Injectable } from "@nestjs/common";
import { FormData } from "formdata-node";
import { OpenAI, Uploadable } from "openai";
@Injectable()
export class OpenAIService {
  private readonly openai = new OpenAI({
    apiKey: process.env.OPENAI_SECRET_KEY,
  });

  async transcribe(fileStream: Readable) {
    return await this.openai.audio.transcriptions.create({
      file: fileStream as unknown as Uploadable,
      model: "whisper-1",
    });
  }

  async transcribeAudio(file: Storage.MultipartFile | Buffer): Promise<string> {
    const form = new FormData();
    let blob: Blob;

    if ("buffer" in file && "mimetype" in file) {
      blob = new Blob([file.buffer as Buffer], { type: file.mimetype });
    } else {
      blob = new Blob([file as Buffer], { type: "audio/mpeg" });
    }

    form.set("file", blob);
    form.set("model", "whisper-1");

    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_SECRET_KEY}`,
      },
      body: form as unknown as BodyInit,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to transcribe audio: ${response.status} - ${error}`);
    }

    const result = await response.json();
    return result.text;
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

  async askChatGPT(text: string, prompt: string, model: string) {
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
}
