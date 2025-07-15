import { Body, Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileFastifyInterceptor } from "fastify-file-interceptor";
import { diskStorage } from "multer";
import { SummaryLength } from "@/constants/app.constant";
import { ToolsSummaryDto } from "./dto/tools.schema";
import { ToolsService } from "./tools.service";

@Controller("tools")
export class ToolsController {
  constructor(private readonly toolsService: ToolsService) {}

  @Post("/summarize")
  @UseInterceptors(
    FileFastifyInterceptor("inputFile", {
      storage: diskStorage({
        destination: "./upload/single",
      }),
    }),
  )
  async summarize(@Body() dto: ToolsSummaryDto, @UploadedFile() file?: any) {
    const SummarySize = dto.summaryLength as keyof typeof SummaryLength;
    switch (dto.summaryType) {
      case "text":
        return await this.toolsService.summarizeText(dto.inputText || "", dto.summaryTone, SummaryLength[SummarySize]);
      case "url": {
        const urlText = await this.toolsService.fetchAndCleanWebPage(dto.inputUrl || "");
        return await this.toolsService.summarizeText(urlText || "", dto.summaryTone, SummaryLength[SummarySize]);
      }
      case "pdf": {
        if (!file?.path) {
          throw new Error("No PDF file uploaded");
        }
        const pdfText = await this.toolsService.extractTextFromPDF(file.path);
        return await this.toolsService.summarizeText(pdfText, dto.summaryTone, SummaryLength[SummarySize]);
      }
      case "audio":
      case "video": {
        if (!file?.path) {
          throw new Error("No audio/video file uploaded");
        }
        const transcript = await this.toolsService.transcribeAudio(file.path);
        return await this.toolsService.summarizeText(transcript, dto.summaryTone, SummaryLength[SummarySize]);
      }
      case "image":
        if (!file?.path) {
          throw new Error("No image file uploaded");
        }
        return await this.toolsService.summarizeImage(file.path, dto.summaryTone, SummaryLength[SummarySize]);
      default:
        throw new Error("Unsupported summary type");
    }
  }
}
