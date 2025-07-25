"use client";

import { useAuth } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@workspace/ui/components/button";
import { Form, FormControl, FormField, FormItem } from "@workspace/ui/components/form";
import { Textarea } from "@workspace/ui/components/textarea";
import { Send, Sparkles } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import useUserHook from "@/hooks/useUserHook";
import { MessagesSchema, messagesChatSchema } from "@/lib/schema";
import { Message } from "@/lib/types";
import { chatService } from "@/services/chat/chat-service";
import ChatHelper from "./ChatHelper";

type Props = {
  chatId?: string;
};

const ChatPage = ({ chatId = "" }: Props) => {
  const { ChatMessage } = ChatHelper();
  const { getToken } = useAuth();

  const [displayedSummary, setDisplayedSummary] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const user = useUserHook();
  const queryClient = useQueryClient();

  const [defaultChatId, setDefaultChatId] = useState<string>(chatId);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const form = useForm<MessagesSchema>({
    resolver: zodResolver(messagesChatSchema),
    defaultValues: {
      message: "",
      chatId: defaultChatId,
      modelId: "4f6bdbbe-8b98-48cb-a340-3f7bd7b6d11e",
    },
  });

  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery({
    queryKey: ["messages", defaultChatId],
    queryFn: async ({ pageParam = 1 }) => {
      const token = await getToken();
      return chatService.getMessages({ chatId: defaultChatId, page: pageParam, limit: 15 }, token ?? "");
    },
    getNextPageParam: (lastPage, pages) => (lastPage.data.length > 0 ? pages.length + 1 : undefined),
    enabled: !!defaultChatId,
    initialPageParam: 1,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 5,
  });

  const messages = useMemo(() => data?.pages.flatMap((p) => p.data) ?? [], [data]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const message = form.watch("message") || "";

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleSubmit = async (data: MessagesSchema) => {
    form.reset();

    const token = await getToken();
    const optimisticId = crypto.randomUUID();

    await queryClient.cancelQueries({ queryKey: ["messages", defaultChatId] });

    const previous = queryClient.getQueryData<{ pages: { data: Message[]; count: number }[] }>([
      "messages",
      defaultChatId,
    ]);

    if (previous) {
      const optimisticMessage: Message = {
        workspace_conversation_id: optimisticId,
        workspace_conversation_content: data.message,
        workspace_conversation_member: user?.id ?? "", // user = sender
      };

      const updatedPages = previous.pages.map((page, index) => {
        if (index === previous.pages.length - 1) {
          return {
            ...page,
            data: [...page.data, optimisticMessage],
          };
        }
        return page;
      });

      queryClient.setQueryData(["messages", defaultChatId], {
        ...previous,
        pages: updatedPages,
      });
    }

    const { data: response, chatId } = await chatService.createChat(data, token ?? "");

    if (!defaultChatId) {
      window.history.pushState(null, "", `/c/${chatId}`);
    }

    setDefaultChatId(chatId);

    setIsTyping(true);
    setDisplayedSummary("");

    let i = 0;
    const interval = setInterval(() => {
      setDisplayedSummary((prev) => prev + response.workspace_conversation_content.charAt(i));
      i++;
      if (i >= response.workspace_conversation_content.length) {
        clearInterval(interval);
        setIsTyping(false);

        queryClient.setQueryData(["messages", defaultChatId], (oldData: any) => {
          if (!oldData) return oldData;

          const updatedPages = oldData.pages.map((page: any, index: number) => {
            if (index === oldData.pages.length - 1) {
              return {
                ...page,
                data: [...page.data, response],
              };
            }
            return page;
          });

          return { ...oldData, pages: updatedPages };
        });
      }
    }, 20);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  return (
    <div className="flex flex-col h-full relative justify-start items-start max-w-5xl mx-auto ">
      <div className="flex-1 p-4 overflow-y-auto overflow-x-hidden pb-16 px-10">
        <div className="max-w-7xl mx-auto space-y-4 h-fit">
          {messages.map((message) => (
            <ChatMessage key={message.workspace_conversation_id} message={message} user={user} />
          ))}

          {isTyping && displayedSummary && (
            <ChatMessage
              message={{
                workspace_conversation_id: "typing",
                workspace_conversation_content: displayedSummary,
                workspace_conversation_member: "agent",
              }}
              user={user}
            />
          )}

          {isFetching && (
            <div className="flex gap-6">
              <div className="w-8 h-8 bg-black rounded-sm flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex gap-1 items-center">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-200" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-400" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {messages.length > 0 || defaultChatId ? (
        <div className="w-full p-4 z-50">
          <div className="max-w-7xl mx-auto">
            <div className="relative">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)}>
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            ref={textareaRef}
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            name={field.name}
                            placeholder="Message Claude..."
                            className="w-full max-h-96 rounded-lg border px-4 py-3 pr-12 text-sm resize-none"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    disabled={!message.trim() || isFetching}
                    className="absolute right-2 bottom-2 p-1.5 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 z-40 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-white/90 mb-4">Where shall we start?</h2>
            <p className="text-muted-foreground mb-3">Here are a few suggestions:</p>
            <ul className="text-sm text-muted-foreground/80 space-y-1">
              <li>• What's on your mind today?</li>
              <li>• Help me write a tweet.</li>
              <li>• Explain a complex topic simply.</li>
            </ul>
            <div className="mt-6 w-[90vw] max-w-2xl mx-auto">
              <div className="relative">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)}>
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              ref={textareaRef}
                              value={field.value}
                              onChange={field.onChange}
                              onBlur={field.onBlur}
                              name={field.name}
                              placeholder="Message Claude..."
                              className="w-full max-h-96 rounded-lg border px-4 py-3 pr-12 text-sm resize-none"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      disabled={!message.trim() || isFetching}
                      className="absolute right-2 bottom-2 p-1.5 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                    >
                      <Send className="w-5 h-5" />
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
