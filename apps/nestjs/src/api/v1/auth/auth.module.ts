import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { ClerkClientProvider } from "../../../providers/clerk/clerk-client.service";
import { ClerkStrategy } from "./clerk.strategy";

@Module({
    imports: [PassportModule, ConfigModule],
    providers: [ClerkStrategy, ClerkClientProvider],
    exports: [PassportModule],
})
export class AuthModule {}
