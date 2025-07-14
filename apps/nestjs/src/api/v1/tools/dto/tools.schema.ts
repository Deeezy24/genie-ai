import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const ToolsSchema = z.object({
  summaryMode: z.enum(["Simple", "Detailed", "Bullet Points"]),
  summaryLength: z.number().min(25).max(75),
  inputText: z.string().trim().min(1, { message: "Text is required" }),
  workspaceId: z.string(),
});

class ToolsSummaryDto extends createZodDto(ToolsSchema) {}

export { ToolsSummaryDto };
