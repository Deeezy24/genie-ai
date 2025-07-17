import * as fs from "node:fs";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import * as cheerio from "cheerio";
import pdfParse from "pdf-parse";
import { DEFAULT_MESSAGE } from "@/constants/app.constant";
import { AnthropicService } from "@/service/anthropic/anthropic.service";
import { OpenAIService } from "@/service/openai/openai.service";
import { PrismaService } from "@/service/prisma/prisma.service";

@Injectable()
export class ToolsService {
  constructor(
    private readonly openaiService: OpenAIService,
    private readonly anthropicService: AnthropicService,
    private readonly prisma: PrismaService,
  ) {}

  async fetchAndCleanWebPage(url: string): Promise<string> {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    return $("body").text().replace(/\s+/g, " ").trim();
  }

  async extractTextFromBuffer(buffer: Buffer): Promise<string> {
    try {
      const data = await pdfParse(buffer);
      return data.text;
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to extract text from PDF buffer: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  async transcribeAudio(file: Storage.MultipartFile): Promise<string> {
    const result = await this.openaiService.transcribeAudio(file);
    return result;
  }

  async transcribeVideoAudio(file: Storage.MultipartFile): Promise<string> {
    return this.transcribeAudio(file);
  }

  async summarizeText(
    text: string,
    tone: string,
    length: string,
    memberId: string,
  ): Promise<{ message: string; data: string }> {
    const prompt = this.buildPrompt(tone, `${length}`, "text");

    if (process.env.NODE_ENV === "local") {
      await this.saveMessageResponse(text, DEFAULT_MESSAGE, memberId, "genie - text");
      return { message: "Summarized with OpenAI", data: DEFAULT_MESSAGE };
    } else {
      try {
        const anthropicResult = await this.anthropicService.summarizeText(text, prompt);
        if (!anthropicResult) {
          throw new Error("Anthropic returned null result");
        }

        await this.saveMessageResponse(text, anthropicResult, memberId, "genie - text");

        return { message: "Summarized with Anthropic", data: anthropicResult };
      } catch (anthropicError) {
        try {
          const openAiResult = await this.openaiService.summarizeText(text, prompt);
          if (!openAiResult) {
            throw new Error("OpenAI returned null result");
          }

          await this.saveMessageResponse(text, openAiResult, memberId, "genie - text");
          return { message: "Summarized with OpenAI", data: openAiResult };
        } catch (openAiError) {
          throw new Error("Both LLMs failed to generate a summary.");
        }
      }
    }
  }

  async summarizeImage(
    filePath: string,
    tone: string,
    length: string,
    memberId: string,
  ): Promise<{ message: string; data: string }> {
    const imageBuffer = fs.readFileSync(filePath);
    const base64Image = imageBuffer.toString("base64");
    const prompt = this.buildPrompt(tone, length, "image");

    if (process.env.NODE_ENV === "local") {
      await this.saveMessageResponse(base64Image, DEFAULT_MESSAGE, memberId, "genie - image");
      return { message: "Summarized with Anthropic", data: DEFAULT_MESSAGE };
    } else {
      try {
        const anthropicResult = await this.anthropicService.summarizeImageWithVision(base64Image, prompt);
        if (!anthropicResult) {
          throw new Error("Anthropic returned null result");
        }

        await this.saveMessageResponse(base64Image, anthropicResult, memberId, "genie - image");

        return { message: "Summarized with Anthropic", data: anthropicResult };
      } catch (anthropicError) {
        try {
          const openAiResult = await this.openaiService.summarizeImageWithVision(base64Image, prompt);
          if (!openAiResult) {
            throw new Error("OpenAI returned null result");
          }

          await this.saveMessageResponse(base64Image, openAiResult, memberId, "genie - image");

          return { message: "Summarized with OpenAI", data: openAiResult };
        } catch (openAiError) {
          throw new Error("Both LLMs failed to summarize the image.");
        }
      }
    }
  }

  async saveMessageResponse(message: string, response: string, memberId: string, agent: string): Promise<void> {
    await this.prisma.workspace_message_table.create({
      data: {
        workspace_message_content: message,
        workspace_member_id: memberId,
        agent_response: {
          create: {
            workspace_agent_response_content: response,
            workspace_agent: agent,
          },
        },
      },
    });
  }

  private buildPrompt(tone: string, length: string, type: string): string {
    return `Please summarize the following ${type} with a ${tone.toLowerCase()} tone. Make it ${length}.`;
  }
}
