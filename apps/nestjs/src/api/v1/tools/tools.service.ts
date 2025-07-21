import ytdl from "@distube/ytdl-core";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import * as cheerio from "cheerio";
import pdfParse from "pdf-parse";
import { YoutubeTranscript } from "youtube-transcript";
import { DEFAULT_MESSAGE } from "@/constants/app.constant";
import { AnthropicService } from "@/service/anthropic/anthropic.service";
import { OpenAIService } from "@/service/openai/openai.service";
import { PrismaService } from "@/service/prisma/prisma.service";
import { FFmpegService } from "@/utils/ffmpeg.service";

@Injectable()
export class ToolsService {
  constructor(
    private readonly openaiService: OpenAIService,
    private readonly anthropicService: AnthropicService,
    private readonly prisma: PrismaService,
    private readonly ffmpegService: FFmpegService,
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

  async transcribeVideoAudio(file: Buffer): Promise<string> {
    return await this.openaiService.transcribeAudio(file);
  }

  async getYoutubeTranscript(videoUrl: string, startTimeSec?: number, endTimeSec?: number): Promise<string> {
    try {
      const transcript = await YoutubeTranscript.fetchTranscript(videoUrl);

      const transcriptText = transcript
        .filter((item) => {
          if (startTimeSec != null && endTimeSec != null) {
            const timestampSec = item.offset / 1000;
            return timestampSec >= startTimeSec && timestampSec <= endTimeSec;
          }
          return true;
        })
        .map((item) => item.text)
        .join(" ");

      return transcriptText;
    } catch (error) {
      console.error("Failed to fetch transcript:", error);
      return "";
    }
  }

  async downloadYoutubeAudioAsBuffer(url: string): Promise<Buffer> {
    const audioStream = ytdl(url, {
      quality: "highestaudio",
      filter: "audioonly",
      range: { start: 0, end: 0 },
      requestOptions: {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
          Accept: "*/*",
          "Accept-Language": "en-US,en;q=0.9",
          Referer: "https://www.youtube.com/",
          Origin: "https://www.youtube.com",
          Connection: "keep-alive",
        },
      },
    });

    return await this.streamToBuffer(audioStream);
  }

  async summarizeYoutubeVideo(url: string, start: string, end: string, summaryType: string) {
    const startTimeSec = this.timeStringToSeconds(start);
    const endTimeSec = this.timeStringToSeconds(end);

    let transcript = "";

    if (!transcript) {
      try {
        const shouldTrim = summaryType === "Specific Time" && startTimeSec != null && endTimeSec != null;

        const finalAudioBuffer = shouldTrim
          ? await this.downloadYoutubeAudioAsBufferWithTrim(url, startTimeSec, endTimeSec)
          : await this.downloadYoutubeAudioAsBuffer(url);

        transcript = await this.transcribeVideoAudio(finalAudioBuffer);
      } catch (err) {
        console.error("Audio download failed, fallback to transcript:", err);
      }
    }
    return transcript;
  }

  async downloadYoutubeAudioAsBufferWithTrim(url: string, start: number, end: number): Promise<Buffer> {
    const audioStream = ytdl(url, {
      quality: "highestaudio",
      filter: "audioonly",
      requestOptions: {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
          Accept: "*/*",
          "Accept-Language": "en-US,en;q=0.9",
          Referer: "https://www.youtube.com/",
          Origin: "https://www.youtube.com",
          Connection: "keep-alive",
        },
      },
    });

    const audioBuffer = await this.streamToBuffer(audioStream);

    return await this.ffmpegService.trimAudioBuffer(audioBuffer, start, end);
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
          console.error("OpenAI failed to generate a summary:", openAiError);
          throw new Error("Both LLMs failed to generate a summary.");
        }
      }
    }
  }

  async summarizeImage(
    buffer: Buffer,
    tone: string,
    length: string,
    memberId: string,
  ): Promise<{ message: string; data: string }> {
    const base64Image = buffer.toString("base64");
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

  private timeStringToSeconds(time: string): number {
    const [hh = "0", mm = "0", ss = "0"] = time.split(":");
    return +hh * 3600 + +mm * 60 + +ss;
  }

  private async streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    return Buffer.concat(chunks);
  }
}
