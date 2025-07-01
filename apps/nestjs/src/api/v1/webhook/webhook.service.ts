import { Inject, Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { UserCreatedWebhook } from "./dto/webhook.schema";

@Injectable()
export class WebhookService {
  constructor(@Inject("PrismaClient") private readonly prisma: PrismaClient) {}

  async createUserWebhook(userCreatedWebhook: UserCreatedWebhook) {
    const user = await this.prisma.user_table.create({
      data: {
        user_clerk_id: userCreatedWebhook.data.id,
        email: userCreatedWebhook.data.email_addresses[0]?.email_address ?? "",
        first_name: userCreatedWebhook.data.first_name ?? "",
        last_name: userCreatedWebhook.data.last_name ?? "",
      },
    });

    return user;
  }
}
