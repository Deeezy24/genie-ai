import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/service/prisma/prisma.service";

@Injectable()
export class BillingService {
  constructor(private readonly prisma: PrismaService) {}

  async getBillingHistory(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const billingHistory = await this.prisma.subscription_payment_table.findMany({
      where: {
        subscription_table: {
          subscription_user_id: userId,
        },
      },
      select: {
        subscription_payment_id: true,
        subscription_payment_amount: true,
        subscription_payment_date_created: true,
        subscription_payment_status: true,
        subscription_payment_receipt_url: true,
        subscription_table: {
          select: {
            subscription_plan_table: {
              select: {
                subscription_plan_name: true,
              },
            },
          },
        },
      },
      orderBy: {
        subscription_payment_date_created: "desc",
      },
      take: limit,
      skip,
    });

    const total = await this.prisma.subscription_payment_table.count({
      where: {
        subscription_table: {
          subscription_user_id: userId,
        },
      },
    });

    const formattedBillingHistory = billingHistory.map((item) => ({
      subscription_payment_id: item.subscription_payment_id,
      subscription_payment_amount: item.subscription_payment_amount,
      subscription_payment_date_created: item.subscription_payment_date_created,
      subscription_payment_status: item.subscription_payment_status,
      subscription_payment_receipt_url: item.subscription_payment_receipt_url,
      subscription_plan_name: item.subscription_table.subscription_plan_table.subscription_plan_name,
    }));

    return {
      data: formattedBillingHistory,
      total,
    };
  }
}
