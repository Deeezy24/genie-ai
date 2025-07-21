import { Body, Controller, Post, Req, UseGuards, UseInterceptors } from "@nestjs/common";
import { SummaryLength } from "@/constants/app.constant";
import { Files } from "@/decorator/files/files.decorator";
import { AiRateLimitGuard } from "@/guard/ai-rate-limit/ai-rate-limit.guard";
import { MultipartInterceptor } from "@/interceptor/file/file.interceptor";
import { RedisService } from "@/service/redis/redis.service";
import { ToolsSummaryDto } from "./dto/tools.schema";
import { ToolsService } from "./tools.service";

@Controller("tools")
export class ToolsController {
  constructor(
    private readonly toolsService: ToolsService,
    private readonly redisService: RedisService,
  ) {}

  @Post("/summarize")
  @UseGuards(AiRateLimitGuard)
  async summarize(@Body() dto: ToolsSummaryDto, @Req() req: FastifyRequestWithUser) {
    const SummarySize = dto.summaryLength as keyof typeof SummaryLength;
    const userId = req.user.id;
    const user = req.user.publicMetadata.memberId as string;
    const key = `${userId}-AI-REQUEST`;
    const ttlSeconds = 30 * 24 * 60 * 60;

    try {
      switch (dto.summaryType) {
        case "text":
          return this.summarizeTextType(dto, user, key, ttlSeconds, SummarySize);

        case "url":
          return this.summarizeUrlType(dto, user, key, ttlSeconds, SummarySize);

        case "video":
          return this.summarizeVideoType(dto, user, key, ttlSeconds, SummarySize);

        default:
          throw new Error("Unsupported summary type");
      }
    } catch (error) {
      throw new Error(error as string);
    }
  }

  @Post("/summarize-file")
  @UseGuards(AiRateLimitGuard)
  @UseInterceptors(MultipartInterceptor({ fileType: "*", maxFileSize: 12 * 1024 * 1024 }))
  async summarizeFile(
    @Body() dto: ToolsSummaryDto,
    @Req() req: FastifyRequestWithUser,
    @Files() files: Record<string, Storage.MultipartFile[]>,
  ) {
    const SummarySize = dto.summaryLength as keyof typeof SummaryLength;
    const userId = req.user.id;
    const user = req.user.publicMetadata.memberId as string;
    const file = files.inputFile?.[0];
    const key = `${userId}-AI-REQUEST`;
    const ttlSeconds = 30 * 24 * 60 * 60;

    try {
      switch (dto.summaryType) {
        case "file":
          return this.summarizeFileType(file, dto, user, key, ttlSeconds, SummarySize);

        case "audio":
          return this.summarizeAudioType(file, dto, user, key, ttlSeconds, SummarySize);

        case "image":
          return this.summarizeImageType(file, dto, user, key, ttlSeconds, SummarySize);

        default:
          throw new Error("Unsupported summary type");
      }
    } catch (error) {
      throw new Error(error as string);
    }
  }

  private async summarizeTextType(
    dto: ToolsSummaryDto,
    user: string,
    key: string,
    ttlSeconds: number,
    SummarySize: keyof typeof SummaryLength,
  ) {
    const result = await this.toolsService.summarizeText(
      dto.inputText || "",
      dto.summaryTone,
      SummaryLength[SummarySize],
      user,
    );
    await this.redisService.incrementWithExpiry(key, ttlSeconds);
    return result;
  }

  private async summarizeUrlType(
    dto: ToolsSummaryDto,
    user: string,
    key: string,
    ttlSeconds: number,
    SummarySize: keyof typeof SummaryLength,
  ) {
    const urlText = await this.toolsService.fetchAndCleanWebPage(dto.inputUrl || "");
    const result = await this.toolsService.summarizeText(urlText, dto.summaryTone, SummaryLength[SummarySize], user);
    await this.redisService.incrementWithExpiry(key, ttlSeconds);
    return result;
  }

  private async summarizeVideoType(
    dto: ToolsSummaryDto,
    user: string,
    key: string,
    ttlSeconds: number,
    SummarySize: keyof typeof SummaryLength,
  ) {
    const videoText = await this.toolsService.summarizeYoutubeVideo(
      dto.inputUrl || "",
      dto.startTimestamp || "00:00:00",
      dto.endTimestamp || "00:00:00",
      dto.selectTime || "Full Video",
    );
    const result = await this.toolsService.summarizeText(videoText, dto.summaryTone, SummaryLength[SummarySize], user);
    await this.redisService.incrementWithExpiry(key, ttlSeconds);
    return result;
  }

  private async summarizeFileType(
    file: Storage.MultipartFile | undefined,
    dto: ToolsSummaryDto,
    user: string,
    key: string,
    ttlSeconds: number,
    SummarySize: keyof typeof SummaryLength,
  ) {
    const pdfText = await this.toolsService.extractTextFromBuffer(file?.buffer || Buffer.from(""));
    const result = await this.toolsService.summarizeText(pdfText, dto.summaryTone, SummaryLength[SummarySize], user);
    await this.redisService.incrementWithExpiry(key, ttlSeconds);
    return result;
  }

  private async summarizeAudioType(
    file: Storage.MultipartFile | undefined,
    dto: ToolsSummaryDto,
    user: string,
    key: string,
    ttlSeconds: number,
    SummarySize: keyof typeof SummaryLength,
  ) {
    if (!file) throw new Error("No Audio File");
    const audioText = await this.toolsService.transcribeAudio(file);
    const result = await this.toolsService.summarizeText(audioText, dto.summaryTone, SummaryLength[SummarySize], user);
    await this.redisService.incrementWithExpiry(key, ttlSeconds);
    return result;
  }

  private async summarizeImageType(
    file: Storage.MultipartFile | undefined,
    dto: ToolsSummaryDto,
    user: string,
    key: string,
    ttlSeconds: number,
    SummarySize: keyof typeof SummaryLength,
  ) {
    if (!file) throw new Error("No image file uploaded");
    const result = await this.toolsService.summarizeImage(
      file.buffer,
      dto.summaryTone,
      SummaryLength[SummarySize],
      user,
    );
    await this.redisService.incrementWithExpiry(key, ttlSeconds);
    return result;
  }
}
