// guards/lemon-squeezy.guard.ts
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as crypto from "crypto";
import { FastifyRequest } from "fastify";

@Injectable()
export class LemonSqueezyGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: FastifyRequest = context.switchToHttp().getRequest();
    const signature = request.headers.get("x-signature") as string;

    if (!signature) {
      throw new UnauthorizedException("Missing X-Signature header");
    }

    const rawBody = request.body;
    const secret = this.configService.get<string>("WEBHOOK_SECRET");

    // Ensure rawBody is a string or Buffer for HMAC
    let bodyForHmac: string | Buffer;
    if (typeof rawBody === "string" || Buffer.isBuffer(rawBody)) {
      bodyForHmac = rawBody;
    } else {
      bodyForHmac = JSON.stringify(rawBody ?? {});
    }

    const computedSignature = crypto.createHmac("sha256", secret!).update(bodyForHmac).digest("hex");

    if (signature !== computedSignature) {
      throw new UnauthorizedException("Invalid signature");
    }

    return true;
  }
}
