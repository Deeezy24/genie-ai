// src/utils/ffmpeg.service.ts

import { spawn } from "node:child_process";
import { readFile, unlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import * as path from "node:path";
import { Injectable } from "@nestjs/common";
import ffmpegPath from "ffmpeg-static";
import { v4 as uuid } from "uuid";

@Injectable()
export class FFmpegService {
  async trimAudioBuffer(inputBuffer: Buffer, start: number, end: number): Promise<Buffer> {
    const inputPath = path.join(tmpdir(), `${uuid()}-input.mp3`);
    const outputPath = path.join(tmpdir(), `${uuid()}-output.mp3`);
    await writeFile(inputPath, inputBuffer);

    const duration = end - start;

    await new Promise((resolve, reject) => {
      const ffmpeg = spawn(ffmpegPath as string, [
        "-ss",
        `${start}`,
        "-t",
        `${duration}`,
        "-i",
        inputPath,
        "-acodec",
        "copy",
        outputPath,
      ]);

      ffmpeg.stderr.on("data", (data) => {
        console.error(`FFmpeg stderr: ${data}`);
      });

      ffmpeg.on("close", (code) => {
        if (code === 0) resolve(true);
        else reject(new Error(`FFmpeg exited with code ${code}`));
      });
    });

    const outputBuffer = await readFile(outputPath);

    await unlink(inputPath);
    await unlink(outputPath);

    return outputBuffer;
  }
}
