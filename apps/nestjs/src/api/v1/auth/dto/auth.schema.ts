import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const RegisterSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(20),
});

const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(20),
});

class RegisterDto extends createZodDto(RegisterSchema) {}
class LoginDto extends createZodDto(LoginSchema) {}

export { LoginDto, RegisterDto };
