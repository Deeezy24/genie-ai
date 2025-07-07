"use client";

import { useClerk } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const SsoCallBackPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { handleRedirectCallback, setActive } = useClerk();

  let isSignUp = false;

  useEffect(() => {
    const run = async () => {
      try {
        const params = Object.fromEntries(searchParams.entries());
        const resUnknown = await handleRedirectCallback(params, async (to) => {
          return router.replace(to);
        });

        if (typeof resUnknown !== "object" || resUnknown === null) {
          isSignUp = true;
          return;
        }
        const res = resUnknown as {
          createdSessionId?: string;
          signUp?: unknown;
        };

        if (res.createdSessionId) {
          await setActive({ session: res.createdSessionId });
          router.replace("/m/0/dashboard");
          return;
        }

        if (res.signUp) {
          isSignUp = true;
          router.replace("/onboarding");
          return;
        }
        isSignUp = true;
        router.replace("/sso-callback");
      } catch (err) {
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
