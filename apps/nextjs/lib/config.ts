import axios, { AxiosRequestConfig } from "axios";
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

  const config: AxiosRequestConfig = {
    method,
    url: `${process.env.NEXT_PUBLIC_API_URL}${url}`,
    headers,
  };

  if (method === "get" && data) {
    config.params = data; // ✅ use 'params' for GET
  } else if (data) {
    config.data = data; // ✅ use 'data' for other methods
  }

  try {
    const res = await axios.request<T>(config);
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
  revalidate?: number,
): Promise<T> => {
  const fullUrl = `${process.env.NEXT_PUBLIC_API_URL}${url}`;
  const headers: Record<string, string> = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    "Content-Type": "application/json",
  };

  if (revalidate !== undefined) {
    const queryString = method === "get" && data ? `?${new URLSearchParams(filteredParams(data)).toString()}` : "";
    const res = await fetch(fullUrl + queryString, {
      method: method.toUpperCase(),
      headers,
      ...(method !== "get" && data ? { body: JSON.stringify(data) } : {}),
      next: { revalidate },
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    return res.json();
  }

  // Else fallback to axios
  const config: AxiosRequestConfig = {
    method,
    url: fullUrl,
    headers,
  };

  if (method === "get" && data) {
    config.params = data;
  } else if (data) {
    config.data = data;
  }

  try {
    const res = await axios.request<T>(config);
    return res.data;
  } catch (err) {
    throw parseAxiosError(err);
  }
};

const filteredParams = (data: unknown) =>
  Object.entries(data || {})
    .filter(([_, value]) => value !== undefined && value !== null)
    .reduce(
      (acc, [key, value]) => {
        acc[key] = String(value); // Convert numbers/booleans to string
        return acc;
      },
      {} as Record<string, string>,
    );
