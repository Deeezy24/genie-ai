import type { AxiosError } from "axios";
import axios from "axios";
import { format } from "date-fns";
import { NormalisedAxiosError } from "./types";

export const parseAxiosError = (err: unknown): NormalisedAxiosError => {
  if (axios.isAxiosError(err)) {
    const axiosErr = err as AxiosError<{ message: string }>;
    return {
      status: axiosErr.response?.status,
      message: axiosErr.response?.data?.message ?? axiosErr.message ?? "Something went wrong",
      data: axiosErr.response?.data,
      raw: err,
    };
  }

  if (err instanceof Error) {
    return {
      message: err.message,
      raw: err,
    };
  }

  return {
    message: typeof err === "string" ? err : "Unknown error",
    raw: err,
  };
};

export const formatDate = (date: string) => {
  return format(new Date(date), "dd MMM yyyy");
};

export const getNotificationStyles = (type: string, unread: boolean) => {
  if (!unread) return "border bg-card";

  switch (type) {
    case "payment":
      return "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/50";
    case "subscription":
      return "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/50";
    case "other":
      return "border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950/50";
    default:
      return "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/50";
  }
};

export const getIconColor = (type: string, unread: boolean) => {
  if (!unread) return "text-muted-foreground";

  switch (type) {
    case "payment":
      return "text-green-600 dark:text-green-400";
    case "subscription":
      return "text-yellow-600 dark:text-yellow-400";
    case "other":
      return "text-zinc-600 dark:text-zinc-400";
    default:
      return "text-blue-600 dark:text-blue-400";
  }
};

export const getPastDateInMinutes = (date: string) => {
  const now = new Date();
  const pastDate = new Date(date);
  const diffTime = Math.abs(now.getTime() - pastDate.getTime());
  const diffMinutes = Math.ceil(diffTime / (1000 * 60));
  if (diffMinutes > 60) {
    const diffHours = Math.ceil(diffMinutes / 60);
    if (diffHours > 24) {
      const diffDays = Math.ceil(diffHours / 24);
      return `${diffDays} days ago`;
    }
    return `${diffHours} hrs ago`;
  }
  return `${diffMinutes} mins ago`;
};

export const removeSpecialCharacters = (text: string) => {
  return text
    .replace(/[^a-zA-Z0-9\s]/g, " ") // Replace special characters with space
    .split(" ") // Split by space
    .filter((word) => word && word.length > 0) // Remove empty strings
    .map((word) => word[0]?.toUpperCase() + word.slice(1).toLowerCase()) // Capitalize each word
    .join(" "); // Join back with space
};
