"use client";

import { useClerk } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { userService } from "@/services/user/user-service";

const SsoCallBackPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { handleRedirectCallback, setActive } = useClerk();

  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    const run = async () => {
      try {
        const params = Object.fromEntries(searchParams.entries());

        const result = await handleRedirectCallback(params, async (to) => {
          return router.replace(to);
        });

        if (typeof result !== "object" || result === null) {
          setIsSignUp(true);
          return;
        }

        const { createdSessionId, signUp } = result as { createdSessionId: string; signUp: boolean };

        if (signUp) {
          setIsSignUp(true);
          router.replace("/onboarding");
          return;
        }

        if (createdSessionId) {
          await setActive({ session: createdSessionId });

          // 👇 NEW: Fetch workspaces and redirect accordingly
          const workspaceId = await userService.getDefaultWorkspace(null);

          if (!workspaceId) {
            toast.error("Failed to fetch workspaces.");
            router.replace("/sign-in");
            return;
          }

          if (workspaceId) {
            router.replace(`/m/${workspaceId}/dashboard`);
          }

          return;
        }

        setIsSignUp(true);
        router.replace("/sso-callback");
      } catch (err) {
        toast.error("Authentication failed.");
        router.replace("/sign-in");
      }
    };

    run();
  }, [handleRedirectCallback, setActive, searchParams, router]);

  if (isSignUp) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <h1 className="text-lg font-semibold mb-4">Please complete the CAPTCHA before proceeding</h1>
        <div id="clerk-captcha" data-cl-theme="dark" data-cl-size="flexible" />
      </div>
    );
  }

  return null;
};

export default SsoCallBackPage;
