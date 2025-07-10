"use client";

import { useClerk } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const SsoCallBackPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { handleRedirectCallback, setActive } = useClerk();

  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    const run = async () => {
      try {
        const params = Object.fromEntries(searchParams.entries());

        const result = await handleRedirectCallback(params);

        if (!result) {
          toast.error("Session not found. Try signing in again.");
          router.replace("/sign-in");
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
          router.replace("/callback");
          return;
        }

        // fallback
        toast.error("Something went wrong. Try again.");
        router.replace("/sign-in");
      } catch (err) {
        console.error("SSO error:", err);
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
