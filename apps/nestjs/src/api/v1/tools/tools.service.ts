import { Injectable } from "@nestjs/common";
import * as cheerio from "cheerio";
import * as fs from "fs";
import * as pdfParse from "pdf-parse";
import { GENIE_AGENT_HELPER } from "@/constants/app.constant";
import { OpenAIService } from "@/service/openai/openai.service";

@Injectable()
export class ToolsService {
  constructor(private readonly openaiService: OpenAIService) {}

  async fetchAndCleanWebPage(url: string): Promise<string> {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    return $("body").text().replace(/\s+/g, " ").trim();
  }

  async extractTextFromPDF(filePath: string): Promise<string> {
    const dataBuffer = fs.readFileSync(filePath);
    // pdfParse is imported as a CommonJS module, so use .default
    const data = await (pdfParse as any).default(dataBuffer);
    return data.text;
  }

  async transcribeAudio(filePath: string): Promise<string> {
    const fileStream = fs.createReadStream(filePath);
    const result = await this.openaiService.transcribe(fileStream);
    return result.text;
  }

  async summarizeImage(filePath: string, tone: string, length: string): Promise<string> {
    const imageBuffer = fs.readFileSync(filePath);
    const base64Image = imageBuffer.toString("base64");

    const prompt = `${GENIE_AGENT_HELPER.image} \n\n Please summarize this image with tonality "${tone}" and length "${length}".`;
    const result = await this.openaiService.summarizeImageWithVision(base64Image, prompt);
    return result || "";
  }

  async transcribeVideoAudio(filePath: string): Promise<string> {
    // Optional: extract audio with ffmpeg if needed before passing to OpenAI Whisper
    return this.transcribeAudio(filePath);
  }

  async summarizeText(text: string, tone: string, length: string): Promise<string> {
    const prompt = `${GENIE_AGENT_HELPER.text} \n\n Please summarize this text with tonality "${tone}" and length "${length}".`;
    const result = await this.openaiService.summarizeText(text, prompt);
    return result || "";
  }
}
