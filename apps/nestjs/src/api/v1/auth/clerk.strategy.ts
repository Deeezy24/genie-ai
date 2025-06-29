import * as backend from "@clerk/backend";
import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { FastifyRequest } from "fastify";
import { Strategy } from "passport-custom";

@Injectable()
export class ClerkStrategy extends PassportStrategy(Strategy, "clerk") {
    constructor(
        @Inject("ClerkClient")
        private readonly clerkClient: backend.ClerkClient,
        private readonly configService: ConfigService,
    ) {
        super();
    }

    async validate(req: FastifyRequest): Promise<backend.User> {
        const authHeader = req.headers["authorization"];
        const token = authHeader?.split(" ").pop();

        if (!token) {
            throw new UnauthorizedException("No token provided");
        }

        try {
            const tokenPayload = await backend.verifyToken(token, {
                secretKey: this.configService.get<string>("CLERK_SECRET_KEY"),
            });

            const user = await this.clerkClient.users.getUser(tokenPayload.sub);

            return user;
        } catch (error) {
            console.error("[ClerkStrategy] Token verification failed:", error);
            throw new UnauthorizedException("Invalid token");
        }
    }
}
