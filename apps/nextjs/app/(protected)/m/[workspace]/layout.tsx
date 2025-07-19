import { auth } from "@clerk/nextjs/server";
import { SidebarProvider } from "@workspace/ui/components/sidebar";
import { redirect } from "next/navigation";
import SideBarInitializer from "@/components/Layout/AppSideBar/SideBarInitializer";

const ProtectedLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ workspace: string }>;
}) => {
  const { sessionClaims } = await auth();
  const { workspace } = await params;

  if (!sessionClaims) {
    redirect("/sign-in");
  }

  if (sessionClaims.metadata.onboardingComplete === false) {
    redirect("/onboarding");
  }

  if (workspace !== sessionClaims.metadata.currentWorkspace) {
    redirect(`/m/${sessionClaims.metadata.currentWorkspace}/overview`);
  }

  return (
    <SidebarProvider defaultOpen={false}>
      <SideBarInitializer>{children}</SideBarInitializer>
    </SidebarProvider>
  );
};

export default ProtectedLayout;
