import * as backend from "@clerk/backend";
import { Inject, Injectable } from "@nestjs/common";
import { user_table } from "@prisma/client";
import { PrismaService } from "@/service/prisma/prisma.service";
import { SubscriptionCreatedWebhook, UserCreatedWebhook } from "./dto/webhook.schema";

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

  async createSubscriptionWebhook(subscriptionCreatedWebhook: SubscriptionCreatedWebhook) {
    const subscriptiopn = subscriptionCreatedWebhook.attributes;
    switch (subscriptionCreatedWebhook.meta.event_name) {
      case "subscription_created": {
        const data = await this.prisma.subscription_table.create({
          data: {
            subscription_user_id: subscriptiopn.custom.user_id,
            subscription_plan_id: subscriptiopn.custom.plan_id,
          },
          select: {
            subscription_id: true,
          },
        });

        await this.createPayment(data.subscription_id, subscriptiopn.user_email, "PAID", subscriptiopn);
        break;
      }

      case "subscription_updated":

      case "subscription_payment_failed":
      case "subscription_payment_success":
      case "subscription_payment_recovered":

      default:
        console.log("Unhandled event:", event);
    }
  }
  private async updateStatus(id: string, status: "ACTIVE" | "INACTIVE" | "CANCELLED") {
    await this.prisma.subscription_table.update({
      where: { subscription_id: id },
      data: { subscription_status: status },
    });
  }

  private async createPayment(
    subscriptionId: string,
    email: string,
    status: "PAID" | "FAILED" | "REFUNDED",
    attributes: any,
  ) {
    await this.prisma.subscription_payment_table.upsert({
      where: { subscription_payment_id: subscriptionId },
      update: { subscription_payment_status: status },
      create: {
        subscription_payment_subscription_id: subscriptionId,
        subscription_payment_email: email,
        subscription_payment_status: status,
        subscription_payment_amount: attributes?.first_subscription_item?.quantity ?? 0,
      },
    });
  }

  private async findOrCreatePlan(attributes: any) {
    const variantId = attributes.variant_id.toString();
    const storeId = attributes.store_id.toString();

    const existing = await this.prisma.subscription_plan_table.findFirst({
      where: {
        subscription_plan_product_variant_id: variantId,
        subscription_plan_product_store_id: storeId,
      },
    });

    if (existing) return existing.subscription_plan_id;

    const created = await this.prisma.subscription_plan_table.create({
      data: {
        subscription_plan_name: attributes.variant_name,
        subscription_plan_product_variant_id: variantId,
        subscription_plan_product_store_id: storeId,
        subscription_plan_price: 0,
        subscription_plan_currency: "PHP",
      },
    });

    return created.subscription_plan_id;
  }
}
