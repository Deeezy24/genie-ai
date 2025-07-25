// src/notification/notification.service.ts

import { User } from "@clerk/backend";
import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "@/service/prisma/prisma.service";
import { CreateNotificationDto, GetAllNotificationsDto } from "./dto/notification.schema";

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  async createNotification(dto: CreateNotificationDto, userId: string) {
    try {
      const notification = await this.prisma.notification_table.create({
        data: {
          ...dto,
          notification_read: false,
          notification_user_id: userId,
        },
      });

      await this.updateNotificationCount(userId, "increment", 1);
      return notification;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getAllNotifications(dto: GetAllNotificationsDto, user: User) {
    try {
      const offset = (dto.page - 1) * dto.limit;

      const [notifications, total, notificationCount] = await Promise.all([
        this.prisma.notification_table.findMany({
          where: { notification_user_id: user.id },
          orderBy: { notification_created_at: "desc" },
          skip: offset,
          take: dto.limit,
        }),
        this.prisma.notification_table.count({
          where: { notification_user_id: user.id },
        }),
        this.prisma.notification_count_table.findUnique({
          where: { notification_user_id: user.id },
        }),
      ]);

      return {
        data: notifications,
        count: total,
        unreadCount: notificationCount?.notification_count_unread || 0,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async markAllAsRead(user: User) {
    const { count } = await this.prisma.notification_table.updateMany({
      where: { notification_user_id: user.id, notification_read: false },
      data: { notification_read: true },
    });

    if (count > 0) {
      await this.updateNotificationCount(user.id, "decrement", count);
    }

    return { message: `Marked ${count} notifications as read.` };
  }

  async markAsRead(id: string, user: User) {
    const { count } = await this.prisma.notification_table.updateMany({
      where: { notification_user_id: user.id, notification_id: id },
      data: { notification_read: true },
    });

    if (count > 0) {
      await this.updateNotificationCount(user.id, "decrement", count);
    }

    return { message: `Marked ${count} notifications as read.` };
  }

  private async updateNotificationCount(userId: string, type: "increment" | "decrement", count: number) {
    await this.prisma.notification_count_table.upsert({
      where: { notification_user_id: userId },
      create: {
        notification_user_id: userId,
        notification_count_unread: type === "increment" ? count : 0,
      },
      update: {
        notification_count_unread: {
          [type]: count,
        },
      },
    });
  }
}
