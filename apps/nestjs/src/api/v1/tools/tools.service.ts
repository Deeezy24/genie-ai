import ytdl from "@distube/ytdl-core";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import * as cheerio from "cheerio";
import pdfParse from "pdf-parse";
import { YoutubeTranscript } from "youtube-transcript";
import { DEFAULT_MESSAGE } from "@/constants/app.constant";
import { SummarizerPrompt } from "@/lib/prompts";
import { AnthropicService } from "@/service/anthropic/anthropic.service";
import { OpenAIService } from "@/service/openai/openai.service";
import { PrismaService } from "@/service/prisma/prisma.service";
import { FFmpegService } from "@/utils/ffmpeg.service";
import { getChatTitle } from "@/utils/helper";
import { GetToolsDto } from "./dto/tools.schema";

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

  async summarizeText(params: {
    text: string;
    tone: string;
    length: string;
    chatId: string;
    memberId: string;
    modelId: string;
  }): Promise<{ message: string; data: string; chatId: string }> {
    const { text, tone, length, chatId, memberId, modelId } = params;
    let chat = "";
    const prompt = SummarizerPrompt(tone, `${length}`, "text");

    if (process.env.NODE_ENV === "local") {
      await this.saveMessageResponse({ message: text, response: DEFAULT_MESSAGE, memberId, chatId, modelId: modelId });
      return { message: "Summarized with OpenAI", data: DEFAULT_MESSAGE, chatId: chat };
    } else {
      try {
        const anthropicResult = await this.anthropicService.summarizeText(text, prompt);
        if (!anthropicResult) {
          throw new Error("Anthropic returned null result");
        }

        chat = await this.saveMessageResponse({
          message: text,
          response: anthropicResult,
          memberId,
          chatId,
          modelId,
        });

        return { message: "Summarized with Anthropic", data: anthropicResult, chatId: chat };
      } catch (anthropicError) {
        try {
          const openAiResult = await this.openaiService.summarizeText(text, prompt);
          if (!openAiResult) {
            throw new Error("OpenAI returned null result");
          }

          chat = await this.saveMessageResponse({
            message: text,
            response: openAiResult,
            memberId,
            chatId,
            modelId,
          });
          return { message: "Summarized with OpenAI", data: openAiResult, chatId: chat };
        } catch (openAiError) {
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
    chatId: string,
  ): Promise<{ message: string; data: string; chatId: string }> {
    const base64Image = buffer.toString("base64");
    const prompt = SummarizerPrompt(tone, length, "image");
    let chat = "";
    if (process.env.NODE_ENV === "local") {
      await this.saveMessageResponse({
        message: base64Image,
        response: DEFAULT_MESSAGE,
        memberId,
        chatId,
        modelId: "genie - image",
      });
      return { message: "Summarized with Anthropic", data: DEFAULT_MESSAGE, chatId: chat };
    } else {
      try {
        const anthropicResult = await this.anthropicService.summarizeImageWithVision(base64Image, prompt);
        if (!anthropicResult) {
          throw new Error("Anthropic returned null result");
        }

        chat = await this.saveMessageResponse({
          message: base64Image,
          response: anthropicResult,
          memberId,
          chatId,
          modelId: "genie - image",
        });

        return { message: "Summarized with Anthropic", data: anthropicResult, chatId: chat };
      } catch (anthropicError) {
        try {
          const openAiResult = await this.openaiService.summarizeImageWithVision(base64Image, prompt);
          if (!openAiResult) {
            throw new Error("OpenAI returned null result");
          }

          chat = await this.saveMessageResponse({
            message: base64Image,
            response: openAiResult,
            memberId,
            chatId,
            modelId: "genie - image",
          });

          return { message: "Summarized with OpenAI", data: openAiResult, chatId: chat };
        } catch (openAiError) {
          throw new Error("Both LLMs failed to summarize the image.");
        }
      }
    }
  }

  async saveMessageResponse(params: {
    message: string;
    response: string;
    memberId: string;
    chatId: string;
    modelId: string;
  }): Promise<string> {
    const { message, response, memberId, chatId, modelId } = params;

    if (chatId?.trim()) {
      await this.prisma.workspace_conversation_table.createMany({
        data: [
          {
            workspace_conversation_content: message,

            workspace_conversation_model_id: modelId,
            workspace_coversation_chat_id: chatId,
          },
          {
            workspace_conversation_content: response,
            workspace_conversation_model_id: modelId,
            workspace_coversation_chat_id: chatId,
            workspace_conversation_is_agent: true,
          },
        ],
      });

      return chatId;
    }

    const newChat = await this.prisma.workspace_chat_table.create({
      data: {
        workspace_chat_member_id: memberId,
        workspace_chat_type: "SUMMARIZER",
        workspace_chat_title: getChatTitle(message),
        workspace_conversation: {
          createMany: {
            data: [
              {
                workspace_conversation_content: message,
                workspace_conversation_model_id: modelId,
              },
              {
                workspace_conversation_content: response,
                workspace_conversation_model_id: modelId,
                workspace_conversation_is_agent: true,
              },
            ],
          },
        },
      },
    });

    return newChat.workspace_chat_id;
  }

  async getTools(dto: GetToolsDto, currentWorkspace: string) {
    const { model, isPopular } = dto;

    const whereClause: Prisma.agent_tools_tableWhereInput = {
      ...(model && { agent_tool_name: model }),
      ...(typeof isPopular === "boolean" && { agent_tool_is_popular: isPopular }),
    };

    const tools = await this.prisma.agent_tools_table.findMany({
      where: whereClause,
      select: {
        agent_tool_id: true,
        agent_tool_name: true,
        agent_tool_description: true,
        agent_tool_created_at: true,
        agent_tool_icon: true,
        agent_tool_url: true,
        agent_model_table: {
          select: {
            agent_model_name: true,
          },
        },
      },
      orderBy: {
        agent_tool_created_at: "desc",
      },
    });

    const formattedTools = tools.map((tool) => ({
      agent_tool_id: tool.agent_tool_id,
      agent_tool_name: tool.agent_tool_name,
      agent_tool_description: tool.agent_tool_description,
      agent_tool_created_at: tool.agent_tool_created_at,
      agent_model_agent_name: tool.agent_model_table[0]?.agent_model_name,
      agent_tool_icon: tool.agent_tool_icon,
      agent_tool_url: `/m/${currentWorkspace}/${tool.agent_tool_url}`,
    }));

    return { data: formattedTools };
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
