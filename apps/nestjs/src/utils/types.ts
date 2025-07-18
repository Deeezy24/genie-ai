import { User } from "@clerk/backend";
import type { FastifyRequest } from "fastify";

export type FastifyRequestWithUser = FastifyRequest & { user: User };

export type MultipartOptions = {
  maxFileSize?: number;
  fileType?: string | RegExp;
};

export type FileType = "file" | "audio" | "image";
