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
  async summarize(@Body() dto: ToolsSummaryDto, @Req() req: types.FastifyRequestWithUser) {
    try {
      const SummarySize = dto.summaryLength as keyof typeof SummaryLength;

      const user = req.user.publicMetadata.memberId as string;

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
        case "video": {
          const videoText = await this.toolsService.summarizeYoutubeVideo(
            dto.inputUrl || "",
            dto.startTimestamp || "00:00:00",
            dto.endTimestamp || "00:00:00",
            dto.selectTime || "Full Video",
          );

          return await this.toolsService.summarizeText(videoText, dto.summaryTone, SummaryLength[SummarySize], user);
        }

        default:
          throw new Error("Unsupported summary type");
      }
    } catch (error) {
      console.log(error);
      throw new Error(error as string);
    }
  }

  @Post("/summarize-file")
  @UseInterceptors(MultipartInterceptor({ fileType: "*", maxFileSize: 12 * 1024 * 1024 }))
  async summarizeFile(
    @Body() dto: ToolsSummaryDto,
    @Req() req: types.FastifyRequestWithUser,
    @Files() files: Record<string, Storage.MultipartFile[]>,
  ) {
    try {
      const SummarySize = dto.summaryLength as keyof typeof SummaryLength;

      const user = req.user.publicMetadata.memberId as string;
      const file = files.inputFile?.[0];

      switch (dto.summaryType) {
        case "file": {
          const pdfText = await this.toolsService.extractTextFromBuffer(file?.buffer || Buffer.from(""));
          return await this.toolsService.summarizeText(pdfText, dto.summaryTone, SummaryLength[SummarySize], user);
        }
        case "audio": {
          if (!file) {
            throw new Error("No Audio File");
          }

          const audioText = await this.toolsService.transcribeAudio(file);
          return await this.toolsService.summarizeText(audioText, dto.summaryTone, SummaryLength[SummarySize], user);
        }

        case "image":
          if (!file) {
            throw new Error("No image file uploaded");
          }
          return await this.toolsService.summarizeImage(
            file?.buffer || "",
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
