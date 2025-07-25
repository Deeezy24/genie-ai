import { BadRequestException, Body, Controller, Get, Patch, Post, Query, Req } from "@nestjs/common";
import { CreateNotificationDto, GetAllNotificationsDto, MarkAsReadDto } from "./dto/notification.schema";
import { NotificationService } from "./notification.service";

@Controller("notification")
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post("create")
  async create(@Body() createNotificationDto: CreateNotificationDto, @Req() req: FastifyRequestWithUser) {
    try {
      const user = req.user;
      const notification = await this.notificationService.createNotification(createNotificationDto, user);
      return notification;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get("get-all")
  getAll(@Query() dto: GetAllNotificationsDto, @Req() req: FastifyRequestWithUser) {
    try {
      const user = req.user;

      return this.notificationService.getAllNotifications(dto, user);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Patch("mark-as-read")
  markAsRead(@Query() dto: MarkAsReadDto, @Req() req: FastifyRequestWithUser) {
    try {
      const user = req.user;
      return this.notificationService.markAsRead(dto.id, user);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Patch("mark-all-as-read")
  markAllAsRead(@Req() req: FastifyRequestWithUser) {
    try {
      const user = req.user;
      return this.notificationService.markAllAsRead(user);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
