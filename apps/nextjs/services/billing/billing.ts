import { apiFetch } from "@/lib/config";
import { BillingHistory } from "@/lib/types";

export const billingService = {
  getBillingHistory: async (params: { token: string; page: number; limit: number }) => {
    const { token, page, limit } = params;

    const response = await apiFetch<{ data: BillingHistory[]; total: number }>(
      "get",
      "/billing",
      { page, limit },
      token,
    );

    return response;
  },
};
