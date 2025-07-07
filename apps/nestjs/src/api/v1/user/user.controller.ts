import { BadRequestException, Body, Controller, Post, Req } from "@nestjs/common";
import type { FastifyRequestWithUser } from "@/utils/types";
import { UserOnboardingDto } from "./dto/user.schema";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("/get-user-data")
  async getUserData(@Req() req: FastifyRequestWithUser) {
    try {
      const user = req.user;

      return await this.userService.getUserData(user);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post("onboarding")
  async create(@Body() createUserOnboardingDto: UserOnboardingDto, @Req() req: FastifyRequestWithUser) {
    try {
      const user = req.user;

      return await this.userService.createOnboarding(createUserOnboardingDto, user);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
