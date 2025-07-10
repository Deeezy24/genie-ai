"use client";

import { Protect } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { userService } from "@/services/user/user-service";

export default function PostAuth() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const workspaceId = await userService.getDefaultWorkspace(null);

        if (cancelled) return; // component unmounted

        router.replace(`/m/${workspaceId}/dashboard`);
      } catch (_) {
        router.replace("/sign-out"); // fallback
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <Protect>
      <div className="h-screen flex items-center justify-center">
        <p className="text-sm text-gray-500">Signing you in…</p>
      </div>
    </Protect>
  );
}
