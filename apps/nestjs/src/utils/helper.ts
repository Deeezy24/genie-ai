import { MultipartFile } from "@fastify/multipart";
import { FileTypeValidator, MaxFileSizeValidator } from "@nestjs/common";
import { FileValidator } from "@nestjs/common/pipes/file/file-validator.interface";
import { MultipartOptions } from "./types";

export const getFileFromPart = async (part: MultipartFile): Promise<Storage.MultipartFile> => {
  const buffer = await part.toBuffer();
  return {
    buffer,
    size: buffer.byteLength,
    filename: part.filename,
    mimetype: part.mimetype,
    fieldname: part.fieldname,
  };
};

export const validateFile = (file: Storage.MultipartFile, options: MultipartOptions): string | void => {
  const validators: FileValidator[] = [];

  if (options.maxFileSize) validators.push(new MaxFileSizeValidator({ maxSize: options.maxFileSize }));
  if (options.fileType) validators.push(new FileTypeValidator({ fileType: options.fileType }));

  for (const validator of validators) {
    if (validator.isValid(file)) continue;

    return validator.buildErrorMessage(file);
  }
};

export const getChatTitle = (prompt: string, wordLimit = 5) => {
  const trimmed = prompt.trim();
  const words = trimmed.split(/\s+/).slice(0, wordLimit);
  const title = words.join(" ");

  return title.charAt(0).toUpperCase() + title.slice(1);
};
