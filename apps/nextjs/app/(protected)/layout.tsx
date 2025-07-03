import { auth, currentUser } from "@clerk/nextjs/server";
import { Separator } from "@workspace/ui/components/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@workspace/ui/components/sidebar";
import { redirect } from "next/navigation";
import { AccountSwitcher } from "@/components/Layout/AppSideBar/AccountSwitcher";
import { AppSidebar } from "@/components/Layout/AppSideBar/AppSideBar";
import { Breadcrumbs } from "@/components/Layout/AppSideBar/BreadCrumbs";
import { ThemeSwitcher } from "@/components/Layout/AppSideBar/ThemeSwitcher";
import { User } from "@/lib/types";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { sessionClaims } = await auth();

  if (!sessionClaims) {
    redirect("/sign-in");
  }

  if (sessionClaims.metadata.onboardingComplete === false) {
    redirect("/onboarding");
  }

  const user = await currentUser();

  const safeUser = user
    ? {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        imageUrl: user.imageUrl,
        email: user.emailAddresses?.[0]?.emailAddress ?? "",
      }
    : null;

  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar user={safeUser as unknown as User} variant="inset" collapsible="icon" />
      <SidebarInset className="flex flex-col">
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 rounded-t-xl">
          <div className="flex w-full items-center justify-between px-4 lg:px-6">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1 h-8 w-8" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumbs />
            </div>
            <div className="flex items-center gap-2">
              <ThemeSwitcher />
              <AccountSwitcher user={safeUser as unknown as User} />
            </div>
          </div>
        </header>

        <section className="flex-1 overflow-auto">
          <div className="container mx-auto max-w-screen-2xl p-4 md:p-6 lg:p-8">{children}</div>
        </section>
      </SidebarInset>
    </SidebarProvider>
  );
}
