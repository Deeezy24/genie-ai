"use client";

import { useAuth } from "@clerk/nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@workspace/ui/components/button";
import { Bell, Check } from "lucide-react";
import useNotificationHook from "@/hooks/useNotificationHook";
import { getIconColor, getNotificationStyles, getPastDateInMinutes } from "@/lib/helper";
import { Notification } from "@/lib/types";
import { NotificationService } from "@/services/notification/notification";

const NotificationsPage = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  const { notificationsData, hasNextPage, fetchNextPage, unreadCount } = useNotificationHook();

  const { mutate: markAsReadMutation } = useMutation({
    mutationFn: async (id: string) => {
      const token = await getToken();
      await NotificationService.markAsRead({ token: token || "", id: id });
    },
    onMutate: (id: string) => {
      queryClient.cancelQueries({ queryKey: ["notifications"] });

      const previousNotifications = queryClient.getQueryData<{ pages: { data: Notification[]; count: number }[] }>([
        "notifications",
      ]);

      if (previousNotifications) {
        queryClient.setQueryData(["notifications"], (old: { pages: { data: Notification[]; count: number }[] }) => {
          const newNotifications = old.pages.map((page) => {
            return {
              ...page,
              data: page.data.map((notification: Notification) => {
                return notification.notification_id === id
                  ? { ...notification, notification_read: true }
                  : notification;
              }),
            };
          });
          return {
            count: previousNotifications.pages.reduce((acc, page) => acc + page.count, 0) - 1,
            pages: newNotifications,
          };
        });
      }
    },
  });

  const { mutate: markAllAsReadMutation } = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      await NotificationService.markAllAsRead({ token: token || "" });
    },
    onMutate: () => {
      queryClient.cancelQueries({ queryKey: ["notifications"] });

      const previousNotifications = queryClient.getQueryData<{ pages: { data: Notification[] }[] }>(["notifications"]);

      if (previousNotifications) {
        queryClient.setQueryData(["notifications"], (old: { pages: { data: Notification[]; count: number }[] }) => {
          const newNotifications = old.pages.map((page) => {
            return {
              ...page,
              data: page.data.map((notification: Notification) => ({
                ...notification,
                notification_read: true,
              })),
            };
          });

          return {
            count: 0,
            pages: newNotifications,
          };
        });
      }

      return { previousNotifications };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <div className="flex sm:flex-row flex-col sm:items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Bell className="h-8 w-8 text-foreground" />
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 h-5 w-5 bg-destructive text-white text-xs font-medium rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
                <p className="text-muted-foreground">
                  {unreadCount > 0 ? `${unreadCount} unread notifications` : "All caught up!"}
                </p>
              </div>
            </div>

            {unreadCount > 0 && (
              <Button
                variant="secondary"
                onClick={() => markAllAsReadMutation()}
                className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-sm font-medium transition-colors"
              >
                Mark all read
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {notificationsData?.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No notifications</h3>
              <p className="text-muted-foreground">You're all caught up! Check back later for updates.</p>
            </div>
          ) : (
            notificationsData?.map((notification) => {
              const Icon = notification.notification_type === "success" ? Check : Bell;

              return (
                <div
                  key={notification.notification_id}
                  className={`relative p-4 border rounded-lg transition-all duration-200 hover:shadow-md ${getNotificationStyles(
                    notification.notification_type,
                    notification.notification_read,
                  )}`}
                >
                  {notification.notification_read && (
                    <div className="absolute top-3 right-3 w-2 h-2 bg-primary rounded-full"></div>
                  )}

                  <div className="flex items-start gap-4">
                    <div
                      className={`p-2 rounded-full ${
                        notification.notification_read
                          ? getNotificationStyles(notification.notification_type, true).split(" ")[0]
                          : "bg-muted"
                      }`}
                    >
                      <Icon
                        className={`h-5 w-5 ${getIconColor(notification.notification_type, notification.notification_read)}`}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4
                          className={`text-sm font-semibold ${
                            notification.notification_read ? "text-foreground" : "text-muted-foreground"
                          }`}
                        >
                          {notification.notification_subject}
                        </h4>

                        <div className="flex items-center gap-2">
                          <span className="text-xs sm:block hidden text-muted-foreground">
                            {getPastDateInMinutes(notification.notification_created_at)}
                          </span>
                          <div className="flex items-center gap-1">
                            <span className="text-xs sm:hidden block text-muted-foreground">
                              {getPastDateInMinutes(notification.notification_created_at)}
                            </span>
                            {notification.notification_read && (
                              <Button
                                onClick={() => markAsReadMutation(notification.notification_id)}
                                variant="ghost"
                                className="p-1 hover:bg-accent rounded text-muted-foreground hover:text-foreground transition-colors"
                                title="Mark as read"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>

                      <p
                        className={`text-sm ${notification.notification_read ? "text-foreground" : "text-muted-foreground"}`}
                      >
                        {notification.notification_message}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {hasNextPage && (
          <div className="mt-8 text-center">
            <Button
              variant="ghost"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => fetchNextPage()}
            >
              View all notifications
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
