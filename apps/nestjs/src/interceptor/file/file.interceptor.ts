import { MultipartValue } from "@fastify/multipart";
import { CallHandler, ExecutionContext, HttpException, HttpStatus, mixin, NestInterceptor, Type } from "@nestjs/common";
import type { FastifyRequest } from "fastify";
import { Observable } from "rxjs";
import { getFileFromPart, validateFile } from "@/utils/helper";
import { MultipartOptions } from "@/utils/types";

export function MultipartInterceptor(options: MultipartOptions = {}): Type<NestInterceptor> {
  class MixinInterceptor implements NestInterceptor {
    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
      const req = context.switchToHttp().getRequest() as FastifyRequest;

      if (typeof req.isMultipart !== "function" || !req.isMultipart()) {
        throw new HttpException("The request should be a form-data", HttpStatus.BAD_REQUEST);
      }

      const files: Record<string, any[]> = {};
      const body: Record<string, any> = {};

      for await (const part of req.parts()) {
        if (part.type !== "file") {
          body[part.fieldname] = (part as MultipartValue).value;
          continue;
        }

        const file = await getFileFromPart(part);
        const validationResult = validateFile(file, options);

        if (validationResult) {
          throw new HttpException(validationResult, HttpStatus.UNPROCESSABLE_ENTITY);
        }

        files[part.fieldname] = files[part.fieldname] || [];
        files[part.fieldname]?.push(file);
      }

      // Attach files and body to the request using type assertion to avoid TS error
      (req as any).storedFiles = files;
      req.body = body;

      return next.handle();
    }
  }

  return mixin(MixinInterceptor);
}
