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
