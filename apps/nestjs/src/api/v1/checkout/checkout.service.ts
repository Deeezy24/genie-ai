import { User } from "@clerk/backend";
import { Injectable } from "@nestjs/common";
import axios from "axios";
import { CreateCheckoutDto } from "./dto/checkout.schema";

@Injectable()
export class CheckoutService {
  async createCheckout(createCheckoutDto: CreateCheckoutDto, user: User) {
    const response = await axios.post(
      `${process.env.LEMON_SQUEEZY_URL}/checkouts`,
      {
        headers: {
          Authorization: `Bearer ${process.env.LEMON_SQUEEZY_API_KEY}`,
        },
      },
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
    );

    return response.data.data.attributes.url;
  }
}
