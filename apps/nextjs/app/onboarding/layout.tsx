import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import SignOutButton from "@/components/SignOutButton/SignOutButton";

export default async function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const { sessionClaims } = await auth();

  if (sessionClaims?.metadata.onboardingComplete === true) {
    redirect("/");
  }

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <h1 className="text-xl font-semibold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                Welcome
              </h1>
            </div>

            <div className="flex items-center space-x-6">
              <SignOutButton />
            </div>
          </div>
        </div>
      </header>

      <section className="flex-1">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</div>
      </section>
    </div>
  );
}
