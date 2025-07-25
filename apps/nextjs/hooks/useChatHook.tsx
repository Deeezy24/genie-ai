import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { chatService } from "@/services/chat/chat-service";

const useChatHook = () => {
  const { getToken } = useAuth();
  const { data: chats, isLoading } = useQuery({
    queryKey: ["chats"],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error("No token found");
      const response = await chatService.getChats(token);
      return response;
    },
    staleTime: Infinity,
    gcTime: Infinity,
  });

  return { chats, isLoading };
};

export default useChatHook;
