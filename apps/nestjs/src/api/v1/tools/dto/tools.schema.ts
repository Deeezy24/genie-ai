import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const SummaryTone = z.enum(["Simple", "Detailed", "Bullet Points"]);
const SummaryLength = z.enum(["Short", "Medium", "Long"]);
const SummaryType = z.enum(["text", "url", "pdf", "audio", "image", "video"]);

const ToolsSchema = z
  .object({
    summaryTone: SummaryTone,
    summaryLength: SummaryLength,
    summaryType: SummaryType,
    inputText: z.string().optional(),
    inputUrl: z.string().url().optional(),
    inputFile: z.string().optional(),
    workspaceId: z.string(),
  })
  .superRefine((data, ctx) => {
    switch (data.summaryType) {
      case "text":
        if (!data.inputText || data.inputText.trim() === "") {
          ctx.addIssue({
            path: ["inputText"],
            code: z.ZodIssueCode.custom,
            message: "Text is required for text summary",
          });
        }
        break;
      case "url":
        if (!data.inputUrl || data.inputUrl.trim() === "") {
          ctx.addIssue({
            path: ["inputUrl"],
            code: z.ZodIssueCode.custom,
            message: "URL is required for URL summary",
          });
        }
        break;
      case "pdf":
      case "audio":
      case "image":
      case "video":
        if (!data.inputFile || data.inputFile.trim() === "") {
          ctx.addIssue({
            path: ["inputFile"],
            code: z.ZodIssueCode.custom,
            message: `File is required for ${data.summaryType} summary`,
          });
        }
        break;
    }
  });

class ToolsSummaryDto extends createZodDto(ToolsSchema) {}

export { ToolsSummaryDto };
