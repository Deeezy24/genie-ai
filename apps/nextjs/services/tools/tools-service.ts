import { apiFetchServer } from "@/lib/config";
import { Tools } from "@/lib/types";

export const toolsService = {
  getTools: async (params: { model?: string; isPopular?: boolean; token: string | null; revalidate?: number }) => {
    const { model, isPopular, token, revalidate } = params;

    const response = await apiFetchServer<{ data: Tools[] }>(
      "get",
      "/tools/get-tools",
      {
        model,
        isPopular,
      },
      token,
      revalidate ?? 0,
    );

    return response;
  },
};
