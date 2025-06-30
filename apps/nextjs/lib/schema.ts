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
