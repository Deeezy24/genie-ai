import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { sessionClaims } = await auth();

  if (sessionClaims?.metadata.onboardingComplete === false) {
    redirect("/onboarding");
  }

  return children;
}
