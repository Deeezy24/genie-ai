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

  async getUserData(user: User) {
    const userData = await this.prisma.user_table.findUnique({
      where: { user_id: user.id },
      include: {
        workspace_member_table: {
          include: {
            roles: true,
            workspace: true,
          },
        },
      },
    });

    const formattedUserData = {
      user_id: userData?.user_id,
      email: userData?.email,
      first_name: userData?.first_name,
      last_name: userData?.last_name,
      workspace_member_table: userData?.workspace_member_table,
      workspace: userData?.workspace_member_table?.[0]?.workspace,
    };

    return formattedUserData;
  }

  async getDefaultWorkspace(user: User) {
    const userData = await this.prisma.user_table.findUnique({
      where: { user_id: user.id },
      select: {
        workspace_member_table: {
          select: {
            workspace: {
              select: {
                workspace_id: true,
              },
            },
          },
        },
      },
    });

    return userData?.workspace_member_table?.[0]?.workspace?.workspace_id;
  }

  async createOnboarding(createUserOnboardingDto: UserOnboardingDto, user: User) {
    const workspaceData = await this.prisma.$transaction(async (tx) => {
      const userOnboarding = await tx.user_onboarding_table.create({
        data: {
          user_onboarding_user_id: user.id,
          user_found_us_on: createUserOnboardingDto.foundUsOn,
          user_usage: createUserOnboardingDto.purpose,
          user_interest: createUserOnboardingDto.interests,
        },
        select: {
          user_table: {
            select: {
              workspace_member_table: {
                select: {
                  workspace: {
                    select: {
                      workspace_id: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      const workspace = userOnboarding?.user_table?.workspace_member_table?.[0]?.workspace?.workspace_id;
      return workspace;
    });

    await this.clerk.users.updateUserMetadata(user.id, {
      publicMetadata: {
        onboardingComplete: true,
      },
    });

    return {
      workspace: workspaceData,
      message: "Onboarding created successfully",
    };
  }
}
