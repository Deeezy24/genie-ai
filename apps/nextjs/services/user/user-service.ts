import { apiFetch } from "@/lib/config";

export const userService = {
  getDefaultWorkspace: async (token: string | null) => {
    const response = await apiFetch("get", "/user/get-default-workspace", null, token);

    return response;
  },
};
