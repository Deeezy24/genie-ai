import axios from "axios";
import { parseAxiosError } from "./helper";

export const apiFetch = async <T = unknown>(
  method: "get" | "post" | "put" | "patch" | "delete",
  url: string,
  data?: unknown,
  token?: string | null,
) => {
  const headers: Record<string, string> = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  try {
    const res = await axios.request<T>({
      method,
      url: `${process.env.NEXT_PUBLIC_API_URL}${url}`,
      data,
      headers,
    });

    return res.data;
  } catch (err) {
    throw parseAxiosError(err);
  }
};

export const apiFetchServer = async <T = unknown>(
  method: "get" | "post" | "put" | "patch" | "delete",
  url: string,
  data?: unknown,
  token?: string | null,
) => {
  const headers: Record<string, string> = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  try {
    const res = await axios.request<T>({
      method,
      url: `${process.env.API_URL}${url}`,
      data,
      headers,
    });

    return res.data;
  } catch (err) {
    throw parseAxiosError(err);
  }
};
