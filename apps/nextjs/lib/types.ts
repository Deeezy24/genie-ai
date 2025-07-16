import { LucideIcon } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { SignInSchema } from "./schema";

export type SignInFormProps = {
  signInWithEmail: (data: SignInSchema) => void;
  signInThruGoogle: () => void;
  form: UseFormReturn<SignInSchema>;
};

export type NormalisedAxiosError = {
  status?: number;
  message: string;
  data?: unknown;
  raw: unknown;
};

export interface NavSubItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  comingSoon?: boolean;
  newTab?: boolean;
}

export type NavMainItem = {
  title: string;
  url: string;
  icon?: LucideIcon;
  subItems?: NavSubItem[];
  comingSoon?: boolean;
  newTab?: boolean;
};

export type NavGroup = {
  id: number;
  label?: string;
  icon?: LucideIcon;
  withSeparator?: boolean;
  items?: NavMainItem[];
};

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  imageUrl: string;
  email: string;
  currentWorkspace: string;
};

export type GenieTypes = "text" | "file" | "url";
