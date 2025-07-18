import { Module } from "@nestjs/common";
import { FFmpegService } from "@/utils/ffmpeg.service";
import { ToolsController } from "./tools.controller";
import { ToolsService } from "./tools.service";

@Module({
  controllers: [ToolsController],
  providers: [ToolsService, FFmpegService],
})
export class ToolsModule {}
