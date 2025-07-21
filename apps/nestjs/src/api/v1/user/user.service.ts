import { randomUUID } from "node:crypto";
import type { ClerkClient, User } from "@clerk/backend";
import { Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "@/service/prisma/prisma.service";
import { UserOnboardingDto } from "./dto/user.schema";

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject("ClerkClient") private readonly clerk: ClerkClient,
  ) {}

  async getUserData(user: User) {
    const userData = await this.prisma.user_table.findUnique({
      where: { user_id: user.id },
      include: {
        subscription_table: {
          take: 1,
          orderBy: {
            subscription_date_created: "desc",
          },
          include: {
            subscription_plan_table: {
              select: {
                subscription_plan_name: true,
              },
            },
          },
        },
        workspace_member_table: {
          include: {
            roles: true,
            workspace: true,
          },
        },
      },
    });

    const subscriptionData = {
      subscription_id: userData?.subscription_table?.[0]?.subscription_id,
      subscription_plan: userData?.subscription_table?.[0]?.subscription_plan_table?.subscription_plan_name,
      subscription_status: userData?.subscription_table?.[0]?.subscription_status,
      subscription_date_created: userData?.subscription_table?.[0]?.subscription_date_created,
      subscription_date_updated: userData?.subscription_table?.[0]?.subscription_date_updated,
      subscription_date_ends:
        userData?.subscription_table?.[0]?.subscription_plan_table?.subscription_plan_name === "FREE"
          ? this.calculateTrialEndsAt(userData?.subscription_table?.[0]?.subscription_date_created ?? new Date(), 5)
          : this.calculateTrialEndsAt(userData?.subscription_table?.[0]?.subscription_date_created ?? new Date(), 30),
    };

    const formattedUserData = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      imageUrl: user.imageUrl,
      email: user.emailAddresses?.[0]?.emailAddress ?? "",
      currentWorkspace: userData?.workspace_member_table?.[0]?.workspace?.workspace_id,
      memberId: userData?.workspace_member_table?.[0]?.workspace_member_id,
      subscription: subscriptionData,
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
      await tx.user_onboarding_table.create({
        data: {
          user_onboarding_user_id: user.id,
          user_found_us_on: createUserOnboardingDto.foundUsOn,
          user_usage: createUserOnboardingDto.purpose,
          user_interest: createUserOnboardingDto.interests,
        },
      });

      const workspace = await tx.workspace_table.create({
        data: {
          workspace_name: `Default Workspace - ${user.id}`,
        },
      });

      const member = await tx.workspace_member_table.create({
        data: {
          workspace_member_workspace_id: workspace.workspace_id,
          workspace_member_user_id: user.id,
        },
        select: {
          workspace_member_id: true,
        },
      });

      await tx.workspace_role_table.create({
        data: {
          workspace_id: workspace.workspace_id,
          workspace_role_name: "ADMIN",
          workspace_role_member_id: member.workspace_member_id,
        },
      });

      await tx.workspace_role_permission_table.createMany({
        data: [
          {
            workspace_id: workspace.workspace_id,
            workspace_role_permission_member_id: member.workspace_member_id,
            workspace_role_permission_permission: "CREATE",
          },
          {
            workspace_id: workspace.workspace_id,
            workspace_role_permission_member_id: member.workspace_member_id,
            workspace_role_permission_permission: "READ",
          },
          {
            workspace_id: workspace.workspace_id,
            workspace_role_permission_member_id: member.workspace_member_id,
            workspace_role_permission_permission: "UPDATE",
          },
          {
            workspace_id: workspace.workspace_id,
            workspace_role_permission_member_id: member.workspace_member_id,
            workspace_role_permission_permission: "DELETE",
          },
        ],
        skipDuplicates: true,
      });

      const subscription = await tx.subscription_table.create({
        data: {
          subscription_user_id: user.id,
          subscription_status: "ACTIVE",
          subscription_order_id: randomUUID(),
          subscription_plan_id: "0b46e811-e69d-4ca0-ae02-461e112e0c20",
        },
        include: {
          subscription_plan_table: true,
        },
      });

      return { workspace: workspace.workspace_id, subscription: subscription, member: member };
    });

    const subscriptionData = {
      subscription_id: workspaceData.subscription.subscription_id,
      subscription_plan: workspaceData.subscription.subscription_plan_table.subscription_plan_name,
      subscription_status: workspaceData.subscription.subscription_status,
      subscription_date_created: workspaceData.subscription.subscription_date_created,
      subscription_date_updated: workspaceData.subscription.subscription_date_updated,
    };

    await this.clerk.users.updateUserMetadata(user.id, {
      publicMetadata: {
        onboardingComplete: true,
        currentWorkspace: workspaceData.workspace,
        memberId: workspaceData.member.workspace_member_id,
        subscription: subscriptionData,
      },
    });

    return {
      workspace: workspaceData.workspace,
      message: "Onboarding created successfully",
    };
  }

  private calculateTrialEndsAt(subscriptionDateCreated: Date, interval: number) {
    const subscriptionDate = new Date(subscriptionDateCreated);

    const trialEndsAt = new Date(subscriptionDate);
    trialEndsAt.setDate(trialEndsAt.getDate() + interval);
    trialEndsAt.setHours(0, 0, 0, 0);

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const diff = trialEndsAt.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }
}
