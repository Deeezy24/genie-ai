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
import { ChartPie, Command, Home, SquareArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { NavGroup, User } from "@/lib/types";
import { NavMain } from "./NavMain";
import { NavUser } from "./NavUser";

export const sidebarItems = (user: User): NavGroup[] => [
  {
    id: 1,
    label: "Dashboards",
    items: [
      {
        title: "Dashboards",
        url: `/m/${user.currentWorkspace}/dashboard`,
        icon: Home,
        subItems: [{ title: "Default", url: `/m/${user.currentWorkspace}/dashboard`, icon: ChartPie }],
      },
    ],
  },
  {
    id: 3,
    label: "Misc",
    items: [
      {
        title: "Others",
        url: "/m/0/others",
        icon: SquareArrowUpRight,
        comingSoon: true,
      },
    ],
  },
];

export function AppSidebar({ user, ...props }: React.ComponentProps<typeof Sidebar> & { user: User }) {
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
        <NavMain items={sidebarItems(user)} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
