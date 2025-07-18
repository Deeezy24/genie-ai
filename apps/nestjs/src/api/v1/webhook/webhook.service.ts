import * as backend from "@clerk/backend";
import { Inject, Injectable } from "@nestjs/common";
import { user_table } from "@prisma/client";
import { PrismaService } from "@/service/prisma/prisma.service";
import { UserCreatedWebhook } from "./dto/webhook.schema";

@Injectable()
export class WebhookService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject("ClerkClient") private readonly clerk: backend.ClerkClient,
  ) {}

  async createUserWebhook(userCreatedWebhook: UserCreatedWebhook) {
    let user: user_table | null = null;
    switch (userCreatedWebhook.type) {
      case "user.created": {
        user = await this.prisma.user_table.create({
          data: {
            user_id: userCreatedWebhook.data.id,
            email: userCreatedWebhook.data.email_addresses[0]?.email_address ?? "",
            first_name: userCreatedWebhook.data.first_name ?? "",
            last_name: userCreatedWebhook.data.last_name ?? "",
          },
          select: {
            user_id: true,
            email: true,
            first_name: true,
            last_name: true,
            user_date_created: true,
            user_date_updated: true,
          },
        });

        await this.clerk.users.updateUserMetadata(userCreatedWebhook.data.id, {
          publicMetadata: {
            onboardingComplete: false,
          },
        });

        break;
      }
      case "user.deleted":
        user = await this.prisma.user_table.delete({
          where: {
            user_id: userCreatedWebhook.data.id,
          },
        });
        break;
      default:
        break;
    }

    return user;
  }
}
