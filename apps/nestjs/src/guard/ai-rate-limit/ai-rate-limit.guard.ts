// guards/ai-rate-limit.guard.ts

import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { AI_API_REQUEST } from "@/constants/app.constant";
import { RedisService } from "@/service/redis/redis.service";

@Injectable()
export class AiRateLimitGuard implements CanActivate {
  constructor(private readonly redisService: RedisService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<FastifyRequestWithUser>();

    const userId = request.user.id;
    const subscriptionPlan = request.user.publicMetadata.subscription?.subscription_plan;
    const subscriptionExpiresAt = request.user.publicMetadata.subscription?.subscription_expires_at;

    const redisKey = `${userId}-AI-REQUEST`;

    const countNumber = await this.redisService.getIncrementedValue(redisKey);
    const limit = AI_API_REQUEST[subscriptionPlan as keyof typeof AI_API_REQUEST] ?? 10;

    const { isAllowed, message } = this.checkLimit({
      count: countNumber,
      limit,
      subscriptionExpiresAt,
    });

    if (!isAllowed) {
      throw new ForbiddenException(message);
    }

    return true;
  }

  checkLimit({
    count,
    limit,
    subscriptionExpiresAt,
  }: {
    count: number;
    limit: number;
    subscriptionExpiresAt?: string;
  }): { message: string; isAllowed: boolean } {
    if (subscriptionExpiresAt && new Date(subscriptionExpiresAt) < new Date()) {
      return { message: "Subscription expired", isAllowed: false };
    }

    if (count > limit) {
      return { message: "AI request limit reached", isAllowed: false };
    }

    return { message: "Request Allowed", isAllowed: true };
  }
}
