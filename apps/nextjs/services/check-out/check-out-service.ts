import { apiFetch, apiFetchServer } from "@/lib/config";
import { CheckOutSchema } from "@/lib/schema";
import { BillingHistory } from "@/lib/types";

export const checkOutService = {
  getCheckOutUrl: async (params: { data: CheckOutSchema; token: string }) => {
    const { data, token } = params;
    const response = await apiFetch<{ message: string; checkoutUrl: string }>("post", "/checkout/create", data, token);

    return response;
  },
  getLatestPaidCheckout: async (params: { token: string }) => {
    const { token } = params;
    const response = await apiFetchServer<{ message: string; data: BillingHistory }>(
      "get",
      "/checkout/latest-paid",
      null,
      token,
    );

    return response;
  },
};
