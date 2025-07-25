"use client";

import { Separator } from "@workspace/ui/components/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@workspace/ui/components/sidebar";
import { Command } from "lucide-react";
import Link from "next/link";
import TrialCountdown from "@/components/Reusable/TrialCountDown";
import useChatHook from "@/hooks/useChatHook";
import useUserHook from "@/hooks/useUserHook";
import type { Chat, NavGroup, User } from "@/lib/types";
import DeleteChatButton from "./DeleteChatButton";
import { ChatNavMain } from "./NavMain";

export const sidebarItems = (user: User, chats?: Chat[]): NavGroup[] => [
  {
    id: 0,
    label: "Chats",
    plan: ["FREE", "BASIC", "PRO"],
    items: chats?.map((chat) => ({
      id: chat.workspace_chat_id,
      title: chat.workspace_chat_title,
      url: `/c/${chat.workspace_chat_id}`,
      plan: ["FREE", "BASIC", "PRO"],
    })),
  },
];

export function ChatSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useUserHook();
  const { chats } = useChatHook();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar {...props} className="">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <Link href={`/m/${user.currentWorkspace}/overview`}>
                <Command />
                {!isCollapsed && <span className="text-base font-semibold">Genie</span>}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <ChatNavMain items={sidebarItems(user, chats)} />
      </SidebarContent>
      <SidebarFooter>
        <Separator className="my-2" />
        <TrialCountdown isActive={state === "collapsed"} />
        <DeleteChatButton />
      </SidebarFooter>
    </Sidebar>
  );
}
