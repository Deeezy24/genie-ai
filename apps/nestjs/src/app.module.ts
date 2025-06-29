import { Module } from "@nestjs/common";
import { ZodValidationPipe } from "nestjs-zod";
import { AuthModule } from "./v1/auth/auth.module";
import { AuthService } from "./v1/auth/auth.service";

@Module({
    imports: [AuthModule, ZodValidationPipe],
    providers: [AuthService],
})
export class AppModule {}
