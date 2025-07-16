import { Body, Controller, Post, Req, UseInterceptors } from "@nestjs/common";
import { SummaryLength } from "@/constants/app.constant";
import { Files } from "@/decorator/files/files.decorator";
import { MultipartInterceptor } from "@/interceptor/file/file.interceptor";
import * as types from "@/utils/types";
import { ToolsSummaryDto } from "./dto/tools.schema";
import { ToolsService } from "./tools.service";

@Controller("tools")
export class ToolsController {
  constructor(private readonly toolsService: ToolsService) {}

  @Post("/summarize")
  @UseInterceptors(MultipartInterceptor({ fileType: "*", maxFileSize: 1000_000 }))
  async summarize(
    @Body() dto: ToolsSummaryDto,
    @Req() req: types.FastifyRequestWithUser,
    @Files() files: Record<string, Storage.MultipartFile[]>,
  ) {
    try {
      const SummarySize = dto.summaryLength as keyof typeof SummaryLength;

      const user = req.user.publicMetadata.memberId as string;
      const file = files.inputFile?.[0];

      switch (dto.summaryType) {
        case "text":
          return await this.toolsService.summarizeText(
            dto.inputText || "",
            dto.summaryTone,
            SummaryLength[SummarySize],
            user,
          );
        case "url": {
          const urlText = await this.toolsService.fetchAndCleanWebPage(dto.inputUrl || "");
          return await this.toolsService.summarizeText(
            urlText || "",
            dto.summaryTone,
            SummaryLength[SummarySize],
            user,
          );
        }
        case "file": {
          const pdfText = await this.toolsService.extractTextFromPDF(file?.filename || "");
          return await this.toolsService.summarizeText(pdfText, dto.summaryTone, SummaryLength[SummarySize], user);
        }
        case "audio": {
          if (!file) {
            throw new Error("No Audio File");
          }

          const audioText = await this.toolsService.transcribeAudio(file?.filename || "");
          return await this.toolsService.summarizeText(audioText, dto.summaryTone, SummaryLength[SummarySize], user);
        }

        case "video": {
          if (!file) {
            throw new Error("No audio/video file uploaded");
          }
          const transcript = await this.toolsService.transcribeAudio(file?.filename || "");
          return await this.toolsService.summarizeText(transcript, dto.summaryTone, SummaryLength[SummarySize], user);
        }
        case "image":
          if (!file) {
            throw new Error("No image file uploaded");
          }
          return await this.toolsService.summarizeImage(
            file?.filename || "",
            dto.summaryTone,
            SummaryLength[SummarySize],
            user,
          );
        default:
          throw new Error("Unsupported summary type");
      }
    } catch (error) {
      console.log(error);
      throw new Error(error as string);
    }
  }
}
