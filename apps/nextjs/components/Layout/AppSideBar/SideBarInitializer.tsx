"use client";

import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { LoadingSpinner } from "@workspace/ui/components/loading-spinner";
import { Separator } from "@workspace/ui/components/separator";
import { SidebarInset, SidebarTrigger } from "@workspace/ui/components/sidebar";
import { User } from "@/lib/types";
import { userService } from "@/services/user/user-service";
import { AccountSwitcher } from "./AccountSwitcher";
import { AppSidebar } from "./AppSideBar";
import { Breadcrumbs } from "./BreadCrumbs";
import { ThemeSwitcher } from "./ThemeSwitcher";

const SideBarInitializer = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth();

  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["user-info"],
    queryFn: async () => {
      const token = await auth.getToken();
      if (!token) throw new Error("No token found");
      return userService.getUserProfile(token);
    },
    enabled: !!auth.userId,
  });

  return (
    <>
      {isLoading ||
        (!user && (
          <div className="min-h-screen w-full flex items-center justify-center bg-background/50 z-50 absolute top-0 left-0">
            <LoadingSpinner />
          </div>
        ))}

      <AppSidebar user={user ?? ({} as User)} variant="inset" collapsible="icon" />
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
              <AccountSwitcher user={user ?? ({} as User)} />
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
