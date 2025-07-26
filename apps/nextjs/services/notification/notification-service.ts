import { apiFetch } from "@/lib/config";
import { Notification } from "@/lib/types";

export const NotificationService = {
  getNotifications: async (params: { token: string; page: number; limit: number }) => {
    const { token, page, limit } = params;
    const response = await apiFetch<{ message: string; data: Notification[]; count: number; unreadCount: number }>(
      "get",
      "/notification/get-all",
      { page, limit },
      token,
    );

    return response;
  },
  markAsRead: async (params: { token: string; id: string }) => {
    const { token, id } = params;
    const response = await apiFetch<{ message: string }>("post", "/notification/mark-as-read", { id }, token);

    return response;
  },
  markAllAsRead: async (params: { token: string }) => {
    const { token } = params;
    const response = await apiFetch<{ message: string }>("post", "/notification/mark-all-as-read", null, token);

    return response;
  },
};
