import { BadRequestException, Body, Controller, Get, Post, Req } from "@nestjs/common";
import { CheckoutService } from "./checkout.service";
import { CreateCheckoutDto } from "./dto/checkout.schema";

@Controller("checkout")
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post("create")
  createCheckout(@Body() createCheckoutDto: CreateCheckoutDto, @Req() req: FastifyRequestWithUser) {
    try {
      const user = req.user;

      return this.checkoutService.createCheckout(createCheckoutDto, user);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get("latest-paid")
  getLatestpaidCheckout(@Req() req: FastifyRequestWithUser) {
    try {
      const user = req.user;
      return this.checkoutService.getLatestpaidCheckout(user);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
