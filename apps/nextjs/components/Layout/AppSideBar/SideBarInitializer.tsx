"use client";

import { Separator } from "@workspace/ui/components/separator";
import { SidebarInset, SidebarTrigger } from "@workspace/ui/components/sidebar";
import { AccountSwitcher } from "./AccountSwitcher";
import { AppSidebar } from "./AppSideBar";
import { Breadcrumbs } from "./BreadCrumbs";
import { ThemeSwitcher } from "./ThemeSwitcher";

const SideBarInitializer = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <AppSidebar variant="inset" collapsible="icon" />
      <SidebarInset className="flex flex-col">
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b backdrop-blur transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 rounded-t-xl">
          <div className="flex w-full items-center justify-between px-4 lg:px-6">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1 h-8 w-8" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumbs />
            </div>
            <div className="flex items-center gap-2">
              <ThemeSwitcher />
              <AccountSwitcher />
            </div>
          </div>
        </header>
        <section className="flex-1 overflow-auto">
          <div className="w-full p-4 md:p-6 lg:p-8 max-w-8xl mx-auto">{children}</div>
        </section>
      </SidebarInset>
    </>
  );
};

export default SideBarInitializer;
