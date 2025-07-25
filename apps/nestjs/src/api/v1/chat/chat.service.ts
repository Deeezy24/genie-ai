import { Injectable } from "@nestjs/common";
import { ChatGPTPrompt } from "@/lib/prompts";
import { OpenAIService } from "@/service/openai/openai.service";
import { PrismaService } from "@/service/prisma/prisma.service";
import { getChatTitle } from "@/utils/helper";
import { CreateChatSchema, GetChatsDto } from "./dto/chat.schema";

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly openaiService: OpenAIService,
  ) {}

  async createChat(createChatDto: CreateChatSchema, memberId: string, userId: string) {
    const response = await this.openaiService.askChatGPT(
      createChatDto.message,
      ChatGPTPrompt(createChatDto.message),
      createChatDto.modelId,
    );

    const result = await this.prisma.$transaction(async (tx) => {
      const chatId = createChatDto.chatId || "";

      if (this.test(chatId)) {
        const convo = await tx.workspace_conversation_table.createManyAndReturn({
          data: [
            {
              workspace_conversation_content: createChatDto.message,
              workspace_conversation_model_id: createChatDto.modelId,
              workspace_coversation_chat_id: chatId,
            },
            {
              workspace_conversation_content: response || "",
              workspace_conversation_model_id: createChatDto.modelId,
              workspace_coversation_chat_id: chatId,
              workspace_conversation_is_agent: true,
            },
          ],
          select: {
            workspace_conversation_id: true,
            workspace_conversation_content: true,
            workspace_conversation_model_id: true,
          },
        });

        const formattedChat = {
          workspace_conversation_id: convo[1]?.workspace_conversation_id,
          workspace_conversation_content: convo[1]?.workspace_conversation_content,
          workspace_conversation_member: "agent",
        };

        return { chatId, data: formattedChat };
      }

      const newChat = await this.prisma.workspace_chat_table.create({
        data: {
          workspace_chat_member_id: memberId,
          workspace_chat_type: "CHAT",
          workspace_chat_title: getChatTitle(createChatDto.message),
          workspace_conversation: {
            createMany: {
              data: [
                {
                  workspace_conversation_content: createChatDto.message,
                  workspace_conversation_model_id: createChatDto.modelId,
                },
                {
                  workspace_conversation_content: response || "",
                  workspace_conversation_model_id: createChatDto.modelId,
                  workspace_conversation_is_agent: true,
                },
              ],
            },
          },
        },
        select: {
          workspace_chat_id: true,
          workspace_conversation: {
            select: {
              workspace_conversation_id: true,
              workspace_conversation_content: true,
              workspace_conversation_model_id: true,
            },
          },
        },
      });

      const formattedChat = {
        workspace_conversation_id: newChat.workspace_chat_id,
        workspace_conversation_content: newChat.workspace_conversation[0]?.workspace_conversation_content,
        workspace_conversation_member: "agent",
      };

      return { chatId: newChat.workspace_chat_id, data: formattedChat };
    });

    return result;
  }

  async getAllChats() {
    const chats = await this.prisma.workspace_chat_table.findMany({
      where: {
        workspace_chat_type: "CHAT",
      },
      orderBy: {
        workspace_chat_created_at: "desc",
      },
      select: {
        workspace_chat_id: true,
        workspace_chat_title: true,
      },
    });

    return { data: chats };
  }

  async getAllChatsConversations(dto: GetChatsDto) {
    const { page, limit, chatId } = dto;
    const skip = (page - 1) * limit;
    const chats = await this.prisma.workspace_conversation_table.findMany({
      where: {
        workspace_coversation_chat_id: chatId,
      },
      select: {
        workspace_conversation_id: true,
        workspace_conversation_content: true,
        workspace_conversation_is_agent: true,
        workspace_chat: {
          select: {
            workspace_member: {
              select: {
                user: {
                  select: {
                    user_id: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        workspace_conversation_created_at: "asc",
      },
      skip: skip,
      take: limit,
    });

    const total = await this.prisma.workspace_conversation_table.count({
      where: {
        workspace_coversation_chat_id: chatId,
      },
    });

    const formattedChats = chats.map((chat) => {
      return {
        workspace_conversation_id: chat.workspace_conversation_id,
        workspace_conversation_content: chat.workspace_conversation_content,
        workspace_conversation_member: chat.workspace_conversation_is_agent
          ? "agent"
          : chat.workspace_chat.workspace_member.user.user_id,
      };
    });

    return { data: formattedChats, count: total };
  }

  private test(id: string): boolean {
    return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id);
  }
}
