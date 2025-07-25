import { apiFetch } from "@/lib/config";
import { MessagesSchema } from "@/lib/schema";
import { Chat, Message } from "@/lib/types";

export const chatService = {
  createChat: async (params: MessagesSchema, token: string) => {
    const { message, modelId, chatId } = params;

    const response = await apiFetch<{ data: Message; chatId: string }>(
      "post",
      "/chat/create",
      { message, modelId, chatId },
      token,
    );

    return response;
  },
  getChats: async (token: string) => {
    const response = await apiFetch<{ data: Chat[] }>("get", "/chat/get-all-chats", null, token);

    return response.data;
  },

  getMessages: async (params: { chatId: string; page: number; limit: number }, token: string) => {
    const { chatId, page, limit } = params;

    const response = await apiFetch<{ data: Message[]; count: number }>(
      "get",
      `/chat/get-chat`,
      { page, limit, chatId },
      token,
    );

    return response;
  },
};
