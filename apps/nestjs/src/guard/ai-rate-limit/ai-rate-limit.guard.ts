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
    const redisKey = `${userId}-AI-REQUEST`;

    const countNumber = await this.redisService.getIncrementedValue(redisKey);

    const limit = AI_API_REQUEST[subscriptionPlan as keyof typeof AI_API_REQUEST] ?? 10;

    if (countNumber >= limit) {
      throw new ForbiddenException("AI Request Limit Exceeded");
    }

    return true;
  }
}
