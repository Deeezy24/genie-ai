import { auth } from "@clerk/nextjs/server";
import { SidebarProvider } from "@workspace/ui/components/sidebar";
import { redirect } from "next/navigation";
import SideBarInitializer from "@/components/Layout/AppSideBar/SideBarInitializer";

const ProtectedLayout = async ({ children }: { children: React.ReactNode }) => {
  const { sessionClaims } = await auth();

  if (!sessionClaims) {
    redirect("/sign-in");
  }

  if (sessionClaims.metadata.onboardingComplete === false) {
    redirect("/onboarding");
  }

  return (
    <SidebarProvider defaultOpen={false}>
      <SideBarInitializer>{children}</SideBarInitializer>
    </SidebarProvider>
  );
};

export default ProtectedLayout;
