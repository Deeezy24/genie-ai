import { BadRequestException, Body, Controller, Post, Req } from "@nestjs/common";
import type { FastifyRequestWithUser } from "@/utils/types";
import { CheckoutService } from "./checkout.service";
import { CreateCheckoutDto } from "./dto/checkout.schema";

@Controller("checkout")
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post("create")
  create(@Body() createCheckoutDto: CreateCheckoutDto, @Req() req: FastifyRequestWithUser) {
    try {
      const user = req.user;

      return this.checkoutService.createCheckout(createCheckoutDto, user);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
