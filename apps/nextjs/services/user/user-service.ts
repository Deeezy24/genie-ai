import { apiFetch } from "@/lib/config";
import { User } from "@/lib/types";

export const userService = {
  getDefaultWorkspace: async (token: string | null) => {
    const response = await apiFetch("get", "/user/get-default-workspace", null, token);

    return response;
  },

  getUserProfile: async (token: string | null) => {
    const response = await apiFetch<User>("get", "/user/get-user-data", null, token);

    return response;
  },
};
