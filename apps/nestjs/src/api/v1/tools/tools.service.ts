import { Inject, Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import OpenAI from "openai";
import { ToolsSummaryDto } from "./dto/tools.schema";

@Injectable()
export class ToolsService {
  constructor(
    @Inject("PrismaClient") private readonly prisma: PrismaClient,
    @Inject("OpenAiClient") private readonly openai: OpenAI,
  ) {}

  async create(toolsSummaryDto: ToolsSummaryDto) {
    const response = await this.openai.responses.create({
      model: "gpt-4o-mini",
      input: toolsSummaryDto.inputText,
    });

    return "This action adds a new tool";
  }

  async findAll() {
    return `This action returns all tools`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tool`;
  }

  remove(id: number) {
    return `This action removes a #${id} tool`;
  }
}
