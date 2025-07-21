import { User } from "@clerk/backend";
import { Injectable } from "@nestjs/common";
import axios from "axios";
import { PrismaService } from "@/service/prisma/prisma.service";
import { CreateCheckoutDto } from "./dto/checkout.schema";

@Injectable()
export class CheckoutService {
  constructor(private readonly prisma: PrismaService) {}
  async createCheckout(createCheckoutDto: CreateCheckoutDto, user: User) {
    const response = await axios.post(
      `${process.env.LEMON_SQUEEZY_URL}/checkouts`,
      {
        data: {
          type: "checkouts",
          attributes: {
            checkout_data: {
              custom: {
                user_id: user.id,
                plan_id: createCheckoutDto.planId,
              },
            },
            product_options: {
              name: `${createCheckoutDto.productName} subscription for ${createCheckoutDto.name}`,
              redirect_url: `${process.env.WEBSITE_URL}/payment`,
              receipt_button_text: "Go to your account",
            },
          },
          relationships: {
            store: {
              data: {
                type: "stores",
                id: `${createCheckoutDto.storeId}`,
              },
            },
            variant: {
              data: {
                type: "variants",
                id: `${createCheckoutDto.variantId}`,
              },
            },
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.LEMON_SQUEEZY_API_KEY}`,
          "Content-Type": "application/vnd.api+json",
          Accept: "application/vnd.api+json",
        },
      },
    );

    return {
      message: "Checkout created successfully",
      checkoutUrl: response.data.data.attributes.url,
    };
  }

  async getLatestpaidCheckout(user: User) {
    const checkout = await this.prisma.subscription_table.findFirstOrThrow({
      where: {
        subscription_user_id: user.id,
        subscription_payment_table: {
          some: {
            subscription_payment_status: "PAID",
          },
        },
      },
      select: {
        subscription_payment_table: {
          select: {
            subscription_payment_id: true,
            subscription_payment_status: true,
            subscription_payment_date_created: true,
            subscription_payment_date_updated: true,
          },
        },
      },
      take: 1,
    });

    const formattedCheckout = {
      subscription_payment_id: checkout.subscription_payment_table[0]?.subscription_payment_id,
      subscription_payment_status: checkout.subscription_payment_table[0]?.subscription_payment_status,
      subscription_payment_date_created: checkout.subscription_payment_table[0]?.subscription_payment_date_created,
      subscription_payment_date_updated: checkout.subscription_payment_table[0]?.subscription_payment_date_updated,
    };

    return { message: "Checkout fetched successfully", data: formattedCheckout };
  }
}
