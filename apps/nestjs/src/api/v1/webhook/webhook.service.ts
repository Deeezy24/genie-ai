import * as backend from "@clerk/backend";
import { Inject, Injectable } from "@nestjs/common";
import { SubscriptionStatus, user_table } from "@prisma/client";
import { PrismaService } from "@/service/prisma/prisma.service";
import { NotificationService } from "../notification/notification.service";
import { SubscriptionCreatedWebhook, UserCreatedWebhook } from "./dto/webhook.schema";

@Injectable()
export class WebhookService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
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
            user_customer_id: true,
          },
        });

        await Promise.all([
          this.clerk.users.updateUserMetadata(userCreatedWebhook.data.id, {
            publicMetadata: {
              onboardingComplete: false,
            },
          }),
          this.notificationService.createNotification(
            {
              notification_message: "Account Registered To 5 Days Free Trial",
              notification_subject: `Hello ${userCreatedWebhook.data.first_name}, your account has been registered to 5 days free trial, if you wish to upgrade to a paid plan, please click the link below`,
              notification_cta: `${process.env.WEBSITE_URL}/pricing`,
              notification_type: "other",
            },
            userCreatedWebhook.data.id,
          ),
        ]);

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
    const { event_name } = subscriptionCreatedWebhook.meta;

    switch (event_name) {
      case "subscription_created":
        await this.handleSubscriptionCreated(subscriptionCreatedWebhook);
        break;

      case "subscription_payment_success":
        await this.handlePaymentSuccess(subscriptionCreatedWebhook);
        break;

      case "subscription_cancelled":
        await this.handleSubscriptionCancelled(subscriptionCreatedWebhook);
        break;

      case "subscription_payment_failed":
        await this.handlePaymentFailed(subscriptionCreatedWebhook);
        break;

      case "subscription_paused":
        await this.handleSubscriptionPaused(subscriptionCreatedWebhook);
        break;

      case "subscription_expired":
        await this.handleSubscriptionExpired(subscriptionCreatedWebhook);
        break;

      case "subscription_resumed":
        await this.handleSubscriptionResumed(subscriptionCreatedWebhook);
        break;

      default:
        break;
    }

    return { status: "success" };
  }

  private async handleSubscriptionCreated(webhook: SubscriptionCreatedWebhook) {
    const subscription = webhook.data.attributes;

    await this.prisma.subscription_table.create({
      data: {
        subscription_user_id: webhook.meta.custom_data.user_id,
        subscription_plan_id: webhook.meta.custom_data.plan_id,
        subscription_order_id: String(subscription.order_id),
        subscription_payment_table: {
          create: {
            subscription_payment_email: subscription.user_email,
            subscription_payment_amount: 4,
            subscription_payment_date_next_bill: new Date(subscription.renews_at),
          },
        },
      },
      select: {
        subscription_id: true,
        subscription_status: true,
        subscription_date_created: true,
        subscription_date_updated: true,
      },
    });

    await this.prisma.user_table.update({
      where: { user_id: webhook.meta.custom_data.user_id },
      data: { user_customer_id: String(subscription.customer_id) },
    });
  }

  private async handlePaymentSuccess(webhook: SubscriptionCreatedWebhook) {
    const subscription = webhook.data.attributes;

    const userData = await this.prisma.user_table.findFirstOrThrow({
      where: { user_customer_id: String(subscription.customer_id) },
      select: { user_id: true },
    });

    const payment = await this.prisma.subscription_table.findFirstOrThrow({
      where: { subscription_user_id: userData.user_id },
      orderBy: { subscription_date_created: "desc" },
      take: 1,
    });

    const updatedPayment = await this.prisma.subscription_table.update({
      where: { subscription_order_id: payment.subscription_order_id },
      data: {
        subscription_status: "ACTIVE",
        subscription_payment_table: {
          updateMany: {
            where: { subscription_payment_order_id: payment.subscription_order_id },
            data: {
              subscription_payment_receipt_url: String(subscription.urls.invoice_url),
              subscription_payment_status: "PAID",
            },
          },
        },
      },
      select: {
        subscription_id: true,
        subscription_status: true,
        subscription_date_created: true,
        subscription_date_updated: true,
        subscription_plan_id: true,
        subscription_plan_table: {
          select: {
            subscription_plan_name: true,
          },
        },
      },
    });
    await Promise.all([
      this.handleSessionTouch(
        {
          subscription_id: updatedPayment.subscription_id,
          subscription_plan_name: updatedPayment.subscription_plan_table.subscription_plan_name,
          subscription_status: updatedPayment.subscription_status,
          subscription_date_created: updatedPayment.subscription_date_created,
          subscription_date_updated: updatedPayment.subscription_date_updated,
          subscription_user_id: webhook.meta.custom_data.user_id,
        },
        webhook,
      ),
      this.notificationService.createNotification(
        {
          notification_message: "Your subscription has been activated",
          notification_subject: "Subscription Activated",
          notification_type: "subscription",
        },
        userData.user_id,
      ),
    ]);
  }

  private async handleSubscriptionCancelled(webhook: SubscriptionCreatedWebhook) {
    const orderId = String(webhook.data.attributes.order_id);
    const now = new Date();

    const payment = await this.prisma.subscription_table.update({
      where: { subscription_order_id: orderId },
      data: {
        subscription_status: "CANCELLED",
        subscription_date_updated: now,
        subscription_payment_table: {
          updateMany: {
            where: { subscription_payment_order_id: orderId },
            data: {
              subscription_payment_status: "CANCELLED",
              subscription_payment_date_updated: now,
            },
          },
        },
      },
      select: {
        subscription_id: true,
        subscription_status: true,
        subscription_date_created: true,
        subscription_date_updated: true,
        subscription_plan_id: true,
        subscription_plan_table: {
          select: {
            subscription_plan_name: true,
          },
        },
      },
    });

    await Promise.all([
      this.handleSessionTouch(
        {
          subscription_id: payment.subscription_id,
          subscription_plan_name: payment.subscription_plan_table.subscription_plan_name,
          subscription_status: payment.subscription_status,
          subscription_date_created: payment.subscription_date_created,
          subscription_date_updated: payment.subscription_date_updated,
          subscription_user_id: webhook.meta.custom_data.user_id,
        },
        webhook,
      ),
      this.notificationService.createNotification(
        {
          notification_message: "Your subscription has been cancelled",
          notification_subject: "Subscription Cancelled",
          notification_type: "subscription",
        },
        webhook.meta.custom_data.user_id,
      ),
    ]);
  }

  private async handlePaymentFailed(webhook: SubscriptionCreatedWebhook) {
    const subscription = webhook.data.attributes;

    await this.prisma.subscription_payment_table.create({
      data: {
        subscription_payment_status: "FAILED",
        subscription_payment_email: subscription.user_email,
        subscription_payment_order_id: String(subscription.order_id),
        subscription_payment_amount: 4,
      },
    });
  }

  private async handleSubscriptionPaused(webhook: SubscriptionCreatedWebhook) {
    const orderId = String(webhook.data.attributes.order_id);
    const now = new Date();

    const payment = await this.prisma.subscription_table.update({
      where: { subscription_order_id: orderId },
      data: {
        subscription_status: "INACTIVE",
        subscription_date_updated: now,
        subscription_payment_table: {
          updateMany: {
            where: { subscription_payment_order_id: orderId },
            data: {
              subscription_payment_status: "PAUSED",
              subscription_payment_date_updated: now,
            },
          },
        },
      },
      select: {
        subscription_id: true,
        subscription_status: true,
        subscription_date_created: true,
        subscription_date_updated: true,
        subscription_plan_id: true,
        subscription_plan_table: {
          select: {
            subscription_plan_name: true,
          },
        },
      },
    });

    await Promise.all([
      this.handleSessionTouch(
        {
          subscription_id: payment.subscription_id,
          subscription_plan_name: payment.subscription_plan_table.subscription_plan_name,
          subscription_status: payment.subscription_status,
          subscription_date_created: payment.subscription_date_created,
          subscription_date_updated: payment.subscription_date_updated,
          subscription_user_id: webhook.meta.custom_data.user_id,
        },
        webhook,
      ),
      this.notificationService.createNotification(
        {
          notification_message: "Your subscription has been paused",
          notification_subject: "Subscription Paused",
          notification_type: "subscription",
        },
        webhook.meta.custom_data.user_id,
      ),
    ]);
  }

  private async handleSubscriptionExpired(webhook: SubscriptionCreatedWebhook) {
    const orderId = String(webhook.data.attributes.order_id);
    const now = new Date();

    const payment = await this.prisma.subscription_table.update({
      where: { subscription_order_id: orderId },
      data: {
        subscription_status: "INACTIVE",
        subscription_date_updated: now,
        subscription_payment_table: {
          updateMany: {
            where: { subscription_payment_order_id: orderId },
            data: {
              subscription_payment_status: "EXPIRED",
              subscription_payment_date_updated: now,
            },
          },
        },
      },
      select: {
        subscription_id: true,
        subscription_status: true,
        subscription_date_created: true,
        subscription_date_updated: true,
        subscription_plan_id: true,
        subscription_plan_table: {
          select: {
            subscription_plan_name: true,
          },
        },
      },
    });

    await Promise.all([
      this.handleSessionTouch(
        {
          subscription_id: payment.subscription_id,
          subscription_plan_name: payment.subscription_plan_table.subscription_plan_name,
          subscription_status: payment.subscription_status,
          subscription_date_created: payment.subscription_date_created,
          subscription_date_updated: payment.subscription_date_updated,
          subscription_user_id: webhook.meta.custom_data.user_id,
        },
        webhook,
      ),
      this.notificationService.createNotification(
        {
          notification_message: "Your subscription has been expired",
          notification_subject: "Subscription Expired",
          notification_type: "subscription",
        },
        webhook.meta.custom_data.user_id,
      ),
    ]);
  }

  private async handleSubscriptionResumed(webhook: SubscriptionCreatedWebhook) {
    const orderId = String(webhook.data.attributes.order_id);
    const now = new Date();

    const payment = await this.prisma.subscription_table.update({
      where: { subscription_order_id: orderId },
      data: {
        subscription_status: "ACTIVE",
        subscription_date_updated: now,
        subscription_payment_table: {
          updateMany: {
            where: { subscription_payment_order_id: orderId },
            data: {
              subscription_payment_status: "PAID",
              subscription_payment_date_updated: now,
            },
          },
        },
      },
      select: {
        subscription_id: true,
        subscription_status: true,
        subscription_date_created: true,
        subscription_date_updated: true,
        subscription_plan_id: true,
        subscription_plan_table: {
          select: {
            subscription_plan_name: true,
          },
        },
      },
    });

    await Promise.all([
      await this.handleSessionTouch(
        {
          subscription_id: payment.subscription_id,
          subscription_plan_name: payment.subscription_plan_table.subscription_plan_name,
          subscription_status: payment.subscription_status,
          subscription_date_created: payment.subscription_date_created,
          subscription_date_updated: payment.subscription_date_updated,
          subscription_user_id: webhook.meta.custom_data.user_id,
        },
        webhook,
      ),
      this.notificationService.createNotification(
        {
          notification_message: "Your subscription has been resumed",
          notification_subject: "Subscription Resumed",
          notification_type: "subscription",
        },
        webhook.meta.custom_data.user_id,
      ),
    ]);
  }

  private async handleSessionTouch(
    payment: {
      subscription_id: string;
      subscription_plan_name: string;
      subscription_status: SubscriptionStatus;
      subscription_date_created: Date;
      subscription_date_updated: Date | null;
      subscription_user_id: string;
    },
    webhook: SubscriptionCreatedWebhook,
  ) {
    const formattedSubscription = {
      subscription_id: payment.subscription_id,
      subscription_plan: payment.subscription_plan_name,
      subscription_status: payment.subscription_status,
      subscription_date_created: payment.subscription_date_created,
      subscription_date_updated: payment.subscription_date_updated,
    };

    await this.clerk.users.updateUserMetadata(webhook.meta.custom_data.user_id, {
      publicMetadata: {
        subscription: formattedSubscription,
      },
    });
  }
}
