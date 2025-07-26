import { useAuth } from "@clerk/nextjs";
import { useInfiniteQuery } from "@tanstack/react-query";
import { NotificationService } from "@/services/notification/notification-service";

const useNotificationHook = () => {
  const { getToken } = useAuth();

  const {
    data: notifications,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["notifications"],
    queryFn: async ({ pageParam = 1 }) => {
      const token = await getToken();
      return NotificationService.getNotifications({ token: token || "", page: pageParam, limit: 10 });
    },
    getNextPageParam: (lastPage, pages) => (lastPage.count > pages.length * 10 ? pages.length + 1 : undefined),
    initialPageParam: 1,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 5,
  });

  const notificationsData = notifications?.pages.flatMap((page) => page.data);

  const unreadCount = notifications?.pages.flatMap((page) => page.unreadCount);

  return { notificationsData, hasNextPage, fetchNextPage, unreadCount: unreadCount?.[0] || 0 };
};

export default useNotificationHook;
