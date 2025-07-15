import * as fs from "node:fs";
import { Injectable } from "@nestjs/common";
import * as cheerio from "cheerio";
import * as pdfParse from "pdf-parse";
import { DEFAULT_MESSAGE } from "@/constants/app.constant";
import { AnthropicService } from "@/service/anthropic/anthropic.service";
import { OpenAIService } from "@/service/openai/openai.service";

@Injectable()
export class ToolsService {
  constructor(
    private readonly openaiService: OpenAIService,
    private readonly anthropicService: AnthropicService,
  ) {}

  async fetchAndCleanWebPage(url: string): Promise<string> {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    return $("body").text().replace(/\s+/g, " ").trim();
  }

  async extractTextFromPDF(filePath: string): Promise<string> {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await (pdfParse as any).default(dataBuffer);
    return data.text;
  }

  async transcribeAudio(filePath: string): Promise<string> {
    const fileStream = fs.createReadStream(filePath);
    const result = await this.openaiService.transcribe(fileStream);
    return result.text;
  }

  async transcribeVideoAudio(filePath: string): Promise<string> {
    return this.transcribeAudio(filePath);
  }

  async summarizeText(text: string, tone: string, length: string): Promise<{ message: string; data: string }> {
    const prompt = this.buildPrompt(tone, `${length}`, "text");

    if (process.env.NODE_ENV === "local") {
      return { message: "Summarized with OpenAI", data: DEFAULT_MESSAGE };
    } else {
      try {
        const anthropicResult = await this.anthropicService.summarizeText(text, prompt);
        if (!anthropicResult) {
          throw new Error("Anthropic returned null result");
        }
        return { message: "Summarized with Anthropic", data: anthropicResult };
      } catch (anthropicError) {
        try {
          const openAiResult = await this.openaiService.summarizeText(text, prompt);
          if (!openAiResult) {
            throw new Error("OpenAI returned null result");
          }
          return { message: "Summarized with OpenAI", data: openAiResult };
        } catch (openAiError) {
          throw new Error("Both LLMs failed to generate a summary.");
        }
      }
    }
  }

  async summarizeImage(filePath: string, tone: string, length: string): Promise<{ message: string; data: string }> {
    const imageBuffer = fs.readFileSync(filePath);
    const base64Image = imageBuffer.toString("base64");
    const prompt = this.buildPrompt(tone, length, "image");

    if (process.env.NODE_ENV === "local") {
      return { message: "Summarized with Anthropic", data: DEFAULT_MESSAGE };
    } else {
      try {
        const anthropicResult = await this.anthropicService.summarizeImageWithVision(base64Image, prompt);
        if (!anthropicResult) {
          throw new Error("Anthropic returned null result");
        }
        return { message: "Summarized with Anthropic", data: anthropicResult };
      } catch (anthropicError) {
        try {
          const openAiResult = await this.openaiService.summarizeImageWithVision(base64Image, prompt);
          if (!openAiResult) {
            throw new Error("OpenAI returned null result");
          }

          return { message: "Summarized with OpenAI", data: openAiResult };
        } catch (openAiError) {
          throw new Error("Both LLMs failed to summarize the image.");
        }
      }
    }
  }

  private buildPrompt(tone: string, length: string, type: string): string {
    return `Please summarize the following ${type} with a ${tone.toLowerCase()} tone. Make it ${length}.`;
  }
}
