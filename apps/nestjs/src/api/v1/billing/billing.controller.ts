import { BadRequestException, Controller, Get, Query, Req } from "@nestjs/common";
import { BillingService } from "./billing.service";
import { GetBillingDto } from "./dto/billing.schema";
@Controller("billing")
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get()
  findAll(@Query() query: GetBillingDto, @Req() req: FastifyRequestWithUser) {
    try {
      const { page, limit } = query;
      const user = req.user;
      return this.billingService.getBillingHistory(user.id, page, limit);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
