"use client";

import { useClerk } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function SsoCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { handleRedirectCallback, setActive } = useClerk();

  useEffect(() => {
    const run = async () => {
      try {
        const params = Object.fromEntries(searchParams.entries());
        const resUnknown = await handleRedirectCallback(params, async (to) => {
          return router.replace(to);
        });

        console.log(resUnknown);

        if (typeof resUnknown !== "object" || resUnknown === null) {
          router.replace("/sign-in");
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
          router.replace("/onboarding");
          return;
        }

        router.replace("/sign-in");
      } catch (err) {
        console.error("OAuth callback error:", err);
        router.replace("/sign-in");
      }
    };

    run();
  }, [handleRedirectCallback, setActive, searchParams, router]);

  return null;
}
