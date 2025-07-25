"use client";

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
import { BarChart, Bell, Command, MessageSquare, Newspaper, Settings, SquareArrowUpRight } from "lucide-react";
import Link from "next/link";
import TrialCountdown from "@/components/Reusable/TrialCountDown";
import useNotificationHook from "@/hooks/useNotificationHook";
import useUserHook from "@/hooks/useUserHook";
import type { NavGroup, User } from "@/lib/types";
import { NavMain } from "./NavMain";
import { NavUser } from "./NavUser";

export const sidebarItems = (user: User, unreadCount: number): NavGroup[] => [
  {
    id: 1,
    label: "Dashboard",
    plan: ["FREE", "BASIC", "PRO"],
    items: [
      {
        id: 1,
        title: "Overview",
        url: `/m/${user.currentWorkspace}/overview`,
        icon: BarChart,
        plan: ["FREE", "BASIC", "PRO"],
      },
      {
        id: 2,
        title: "Tools",
        url: `/m/${user.currentWorkspace}/tools`,
        icon: Settings,
        plan: ["FREE", "BASIC", "PRO"],
      },
      {
        id: 3,
        title: "Notification",
        url: `/m/notification`,
        icon: Bell,
        count: unreadCount,
        plan: ["FREE", "BASIC", "PRO"],
      },
      {
        id: 4,
        title: "NewsLetter",
        url: `/m/${user.currentWorkspace}/news`,
        icon: Newspaper,
        plan: ["FREE", "BASIC", "PRO"],
      },
    ],
  },
  {
    id: 3,
    label: "Config",
    plan: ["FREE", "BASIC", "PRO"],
    items: [
      {
        id: 1,
        title: "Documents",
        url: `/m/${user.currentWorkspace}/documents`,
        icon: SquareArrowUpRight,
        plan: ["FREE", "BASIC", "PRO"],
      },
    ],
  },
  {
    id: 4,
    label: "Others",
    withSeparator: true,
    plan: ["BASIC", "PRO"],
    items: [
      {
        id: 1,
        title: "Chat",
        url: `/c`,
        icon: MessageSquare,
        plan: ["BASIC", "PRO"],
      },
    ],
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useUserHook();
  const { unreadCount } = useNotificationHook();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <Link href="#">
                <Command />
                {!isCollapsed && <span className="text-base font-semibold">CoverGenie</span>}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sidebarItems(user, unreadCount)} />
      </SidebarContent>
      <SidebarFooter>
        <TrialCountdown isActive={state === "collapsed"} />
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
