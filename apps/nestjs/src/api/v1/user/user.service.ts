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
      });

      await tx.workspace_role_table.create({
        data: {
          workspace_id: workspace.workspace_id,
          workspace_role_name: "ADMIN",
          workspace_role_member_id: member.workspace_member_id,
        },
      });

      // Then create permissions
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
        skipDuplicates: true, // optional safeguard
      });

      return workspace.workspace_id;
    });

    await this.clerk.users.updateUserMetadata(user.id, {
      publicMetadata: {
        onboardingComplete: true,
        currentWorkspace: workspaceData,
      },
    });

    return {
      workspace: workspaceData,
      message: "Onboarding created successfully",
    };
  }
}
