"use client";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@workspace/ui/components/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Separator } from "@workspace/ui/components/separator";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@workspace/ui/components/sidebar";
import { ChevronRight, PlusCircleIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import useUserHook from "@/hooks/useUserHook";
import { NavGroup, NavMainItem } from "@/lib/types";

type NavMainProps = {
  readonly items: readonly NavGroup[];
};

const IsComingSoon = () => (
  <span className="ml-auto rounded-md bg-gray-200 px-2 py-1 text-xs dark:text-gray-800">Soon</span>
);

const NavItemExpanded = ({
  item,
  isActive,
  isSubmenuOpen,
  currentPlan,
}: {
  item: NavMainItem;
  isActive: (url: string, subItems?: NavMainItem["subItems"]) => boolean;
  isSubmenuOpen: (subItems?: NavMainItem["subItems"]) => boolean;
  currentPlan: string;
}) => {
  return (
    <Collapsible key={item.title} asChild defaultOpen={isSubmenuOpen(item.subItems)} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          {item.subItems ? (
            <SidebarMenuButton
              disabled={item.comingSoon}
              isActive={isActive(item.url, item.subItems)}
              tooltip={item.title}
            >
              {item.icon && <item.icon />}
              <span>{item.title}</span>
              {item.comingSoon && <IsComingSoon />}
              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </SidebarMenuButton>
          ) : (
            <SidebarMenuButton
              asChild
              aria-disabled={item.comingSoon}
              isActive={isActive(item.url)}
              tooltip={item.title}
            >
              <Link href={item.url} target={item.newTab ? "_blank" : undefined}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
                {item.comingSoon && <IsComingSoon />}
              </Link>
            </SidebarMenuButton>
          )}
        </CollapsibleTrigger>
        {item.subItems && (
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.subItems
                .filter((subItem) => subItem.plan.includes(currentPlan))
                .map((subItem) => (
                  <SidebarMenuSubItem key={subItem.title}>
                    <SidebarMenuSubButton aria-disabled={subItem.comingSoon} isActive={isActive(subItem.url)} asChild>
                      <Link href={subItem.url} target={subItem.newTab ? "_blank" : undefined}>
                        {subItem.icon && <subItem.icon />}
                        <span>{subItem.title}</span>
                        {subItem.comingSoon && <IsComingSoon />}
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        )}
      </SidebarMenuItem>
    </Collapsible>
  );
};

const NavItemCollapsed = ({
  item,
  isActive,
  currentPlan,
}: {
  item: NavMainItem;
  isActive: (url: string, subItems?: NavMainItem["subItems"]) => boolean;
  currentPlan: string;
}) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(item.url);
  };

  return (
    <SidebarMenuItem key={item.id}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            disabled={item.comingSoon}
            tooltip={item.title}
            isActive={isActive(item.url, item.subItems)}
            onClick={handleClick}
          >
            {item.icon && <item.icon />}
            <span>{item.title}</span>
            <ChevronRight />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        {item.subItems && item.subItems.length > 0 && (
          <DropdownMenuContent className="w-50 space-y-1" side="right" align="start">
            {item.subItems &&
              item.subItems.length > 0 &&
              item.subItems
                ?.filter((subItem) => subItem.plan.includes(currentPlan))
                .map((subItem) => (
                  <DropdownMenuItem key={subItem.id} asChild>
                    <SidebarMenuSubButton
                      asChild
                      className="focus-visible:ring-0"
                      aria-disabled={subItem.comingSoon}
                      isActive={isActive(subItem.url)}
                    >
                      <Link href={subItem.url} target={subItem.newTab ? "_blank" : undefined}>
                        {subItem.icon && <subItem.icon className="[&>svg]:text-sidebar-foreground" />}
                        <span>{subItem.title}</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </DropdownMenuItem>
                ))}
          </DropdownMenuContent>
        )}
      </DropdownMenu>
    </SidebarMenuItem>
  );
};

export function ChatNavMain({ items }: NavMainProps) {
  const router = useRouter();
  const path = usePathname();
  const { state, isMobile } = useSidebar();

  const user = useUserHook();

  const isItemActive = (url: string, subItems?: NavMainItem["subItems"]) => {
    if (subItems?.length) {
      return subItems.some((sub) => path.startsWith(sub.url));
    }
    return path === url;
  };

  const isSubmenuOpen = (subItems?: NavMainItem["subItems"]) => {
    return subItems?.some((sub) => path.startsWith(sub.url)) ?? false;
  };

  const currentPlan = user?.subscription.subscription_plan ?? "";

  return (
    <>
      <SidebarGroup>
        <SidebarGroupContent className="flex flex-col gap-2">
          <SidebarMenu>
            <SidebarMenuItem className="flex items-center gap-2">
              <SidebarMenuButton
                onClick={() => router.push("/c")}
                tooltip="Create New Chat"
                className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
              >
                <PlusCircleIcon />
                <span>Create New Chat</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      {items.map((group) => {
        if (!group.plan.includes(currentPlan)) return null;

        return (
          <SidebarGroup key={group.id}>
            {group.withSeparator && <Separator className="my-2" />}
            {group.label && <SidebarGroupLabel>{group.label}</SidebarGroupLabel>}

            <SidebarGroupContent className="flex flex-col gap-2">
              <SidebarMenu>
                {group.items
                  ?.filter((item) => item.plan.includes(currentPlan))
                  .map((item) =>
                    state === "collapsed" && !isMobile ? (
                      <NavItemCollapsed key={item.id} currentPlan={currentPlan} item={item} isActive={isItemActive} />
                    ) : (
                      <NavItemExpanded
                        key={item.id}
                        currentPlan={currentPlan}
                        item={item}
                        isActive={isItemActive}
                        isSubmenuOpen={isSubmenuOpen}
                      />
                    ),
                  )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        );
      })}
    </>
  );
}
