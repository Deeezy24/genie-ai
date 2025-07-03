import type { ClerkClient, User } from "@clerk/backend";
import { Inject, Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { UserOnboardingDto } from "./dto/user.schema";

@Injectable()
export class UserService {
  constructor(
    @Inject("PrismaClient") private readonly prisma: PrismaClient,
    @Inject("ClerkClient") private readonly clerk: ClerkClient,
  ) {}

  async createOnboarding(createUserOnboardingDto: UserOnboardingDto, user: User) {
    await this.prisma.$transaction(async (tx) => {
      await tx.user_onboarding_table.create({
        data: {
          user_onboarding_user_id: user.id,
          user_found_us_on: createUserOnboardingDto.foundUsOn,
          user_usage: createUserOnboardingDto.purpose,
          user_interest: createUserOnboardingDto.interests,
        },
      });

      await this.clerk.users.updateUserMetadata(user.id, {
        publicMetadata: {
          onboardingComplete: true,
        },
      });
    });

    return { message: "Onboarding created successfully" };
  }
}
