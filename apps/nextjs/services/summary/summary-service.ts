import { apiFetch } from "@/lib/config";
import { GenieTextTypes, ParagraphGeneratorTypes } from "@/lib/schema";

export const summaryService = {
  createSummary: async (params: { data: GenieTextTypes | FormData; token: string | null }) => {
    const { data, token } = params;

    const response = await apiFetch<{ message: string; data: string; chatId: string }>(
      "post",
      "/tools/summarize",
      data,
      token,
    );

    return response;
  },
  createSummaryFile: async (params: { data: GenieTextTypes | FormData; token: string | null }) => {
    const { data, token } = params;

    const response = await apiFetch<{ message: string; data: string; chatId: string }>(
      "post",
      "/tools/summarize-file",
      data,
      token,
    );

    return response;
  },

  createParagraph: async (params: { data: ParagraphGeneratorTypes; token: string | null }) => {
    const { data, token } = params;

    const response = await apiFetch<{ message: string; data: string; chatId: string }>(
      "post",
      "/tools/paragraph-generator",
      data,
      token,
    );

    return response;
  },
  createContentRewriter: async (params: { data: ParagraphGeneratorTypes; token: string | null }) => {
    const { data, token } = params;

    const response = await apiFetch<{ message: string; data: string; chatId: string }>(
      "post",
      "/tools/content-rewriter",
      data,
      token,
    );

    return response;
  },
};
