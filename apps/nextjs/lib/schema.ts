import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type SignInSchema = z.infer<typeof signInSchema>;

export const signUpSchema = z
  .object({
    firstName: z.string().trim().min(3, "First name is required").max(50, "First name must be less than 50 characters"),
    lastName: z.string().trim().min(3, "Last name is required").max(50, "Last name must be less than 50 characters"),
    email: z.string().trim().email("Invalid email address"),
    password: z.string().trim().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().trim().min(6, "Confirm Password must be at least 6 characters"),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ["confirmPassword"],
      });
    }
  });

export type SignUpSchema = z.infer<typeof signUpSchema>;

export const verifySchema = z.object({
  code: z.coerce.string().trim().min(6, "Code must be at least 6 characters"),
});

export type VerifySchema = z.infer<typeof verifySchema>;

//change password
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(8, "Must be at least 8 chars"),
    newPassword: z.string().min(8, "Must be at least 8 chars"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;

//genie text schema
const SummaryTone = z.enum(["Simple", "Detailed", "Bullet Points"]);
const SummaryLength = z.number().min(25).max(75);
const SummaryType = z.enum(["text", "url", "file", "audio", "image", "video"]);

export const genieSummarySchema = z
  .object({
    summaryTone: SummaryTone,
    summaryLength: SummaryLength,
    summaryType: SummaryType,
    inputText: z.string().optional(),
    inputUrl: z.string().url().optional(),
    inputFile: z.instanceof(File).optional(),
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
      case "file":
      case "audio":
      case "video":
      case "image":
        break;
    }
  });
export type GenieTextTypes = z.infer<typeof genieSummarySchema>;
