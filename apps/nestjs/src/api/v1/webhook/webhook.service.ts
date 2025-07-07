import * as backend from "@clerk/backend";
import { Inject, Injectable } from "@nestjs/common";
import { PrismaClient, user_table } from "@prisma/client";
import { UserCreatedWebhook } from "./dto/webhook.schema";

@Injectable()
export class WebhookService {
  constructor(
    @Inject("PrismaClient") private readonly prisma: PrismaClient,
    @Inject("ClerkClient") private readonly clerk: backend.ClerkClient,
  ) {}

  async createUserWebhook(userCreatedWebhook: UserCreatedWebhook) {
    let user: user_table | null = null;
    switch (userCreatedWebhook.type) {
      case "user.created": {
        const workspace = await this.prisma.workspace_table.create({
          data: {
            workspace_name: `Default Workspace - ${userCreatedWebhook.data.id}`,
          },
          select: {
            workspace_id: true,
          },
        });

        user = await this.prisma.user_table.create({
          data: {
            user_id: userCreatedWebhook.data.id,
            email: userCreatedWebhook.data.email_addresses[0]?.email_address ?? "",
            first_name: userCreatedWebhook.data.first_name ?? "",
            last_name: userCreatedWebhook.data.last_name ?? "",
            workspace_member_table: {
              create: {
                workspace_member_workspace_id: workspace.workspace_id,
                roles: {
                  create: {
                    workspace_id: workspace.workspace_id,
                    workspace_role_name: "ADMIN",
                    permissions: {
                      createMany: {
                        data: [
                          {
                            workspace_role_permission_permission: "CREATE",
                          },
                          {
                            workspace_role_permission_permission: "READ",
                          },
                          {
                            workspace_role_permission_permission: "UPDATE",
                          },
                          {
                            workspace_role_permission_permission: "DELETE",
                          },
                        ],
                      },
                    },
                  },
                },
              },
            },
          },
        });

        await this.clerk.users.updateUserMetadata(userCreatedWebhook.data.id, {
          publicMetadata: {
            workspace_id: workspace.workspace_id,
          },
        });

        break;
      }
      case "user.deleted":
        user = await this.prisma.user_table.delete({
          where: {
            user_id: userCreatedWebhook.data.id,
          },
        });
        break;
      default:
        break;
    }

    return user;
  }
}
