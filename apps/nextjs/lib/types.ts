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
  id: string;
  newTab?: boolean;
  plan: string[] | "free" | "basic" | "pro";
}

export type NavMainItem = {
  title: string;
  url: string;
  icon?: LucideIcon;
  subItems?: NavSubItem[];
  count?: number;
  comingSoon?: boolean;
  id: string | number;
  newTab?: boolean;
  plan: string[] | "free" | "basic" | "pro";
};

export type NavGroup = {
  id: number;
  label?: string;
  icon?: LucideIcon;
  withSeparator?: boolean;
  items?: NavMainItem[];
  plan: string[] | "free" | "basic" | "pro";
};

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  imageUrl: string;
  email: string;
  currentWorkspace: string;
  subscription: {
    subscription_id: string;
    subscription_plan: string;
    subscription_status: string;
    subscription_date_created: string;
    subscription_date_updated: string;
    subscription_date_ends: number;
  };
};

export type GenieTypes = "text" | "file" | "url" | "audio" | "video" | "image";

export type FileType = "file" | "audio" | "image";

export type BillingHistory = {
  subscription_payment_id: string;
  subscription_payment_status: string;
  subscription_payment_amount: number;
  subscription_payment_email: string;
  subscription_payment_order_id: string;
  subscription_payment_receipt_url: string;
  subscription_plan_name: string;
  subscription_payment_date_created: string;
  subscription_payment_date_updated: string;
  subscription_payment_date_next_bill: string;
};

export type Notification = {
  notification_id: string;
  notification_message: string;
  notification_subject: string;
  notification_type: string;
  notification_cta: string;
  notification_read: boolean;
  notification_created_at: string;
};

export type Chat = {
  workspace_chat_id: string;
  workspace_chat_title: string;
  workspace_chat_created_at: string;
};

export type Message = {
  workspace_conversation_id: string;
  workspace_conversation_content: string;
  workspace_conversation_member: string;
};

export type Tools = {
  agent_tool_id: string;
  agent_tool_name: string;
  agent_tool_description: string;
  agent_tool_created_at: string;
  agent_model_agent_name: string;
  agent_tool_icon: string;
  agent_tool_url: string;
};
