import { BadRequestException, Body, Controller, Get, Post, Query, Req } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { CreateChatDto, GetChatsDto } from "./dto/chat.schema";

@Controller("chat")
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post("create")
  async createChat(@Body() createChatDto: CreateChatDto, @Req() req: FastifyRequestWithUser) {
    try {
      const user = req.user.publicMetadata as publicMetadata;
      const userId = req.user.id;

      return await this.chatService.createChat(createChatDto, user.memberId as string, userId);
    } catch (error) {
      throw new BadRequestException("Something went wrong");
    }
  }

  @Get("get-chat")
  getAllChats(@Query() dto: GetChatsDto) {
    try {
      return this.chatService.getAllChatsConversations(dto);
    } catch (error) {
      throw new BadRequestException("Something went wrong");
    }
  }

  @Get("get-all-chats")
  getAllChatsTitles() {
    try {
      return this.chatService.getAllChats();
    } catch (error) {
      throw new BadRequestException("Something went wrong");
    }
  }
}
