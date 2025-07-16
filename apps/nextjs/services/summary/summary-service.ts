import { apiFetch } from "@/lib/config";
import { GenieTextTypes } from "@/lib/schema";

export const summaryService = {
  createSummary: async (params: { data: GenieTextTypes; token: string | null; formData?: FormData }) => {
    const { data, token, formData } = params;

    const response = await apiFetch<{ message: string; data: string }>(
      "post",
      "/tools/summarize",
      formData || data,
      token,
    );

    return response;
  },
};
