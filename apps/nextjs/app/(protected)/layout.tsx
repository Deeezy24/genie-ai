"use client";

import { useAuth, useSession } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { LoadingSpinner } from "@workspace/ui/components/loading-spinner";
import { useEffect, useRef } from "react";
import { User } from "@/lib/types";
import { userService } from "@/services/user/user-service";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth();
  const { session } = useSession();

  const hasRefreshedSession = useRef(false);

  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["user-info"],
    queryFn: async () => {
      const token = await auth.getToken();
      if (!token) throw new Error("No token found");
      return userService.getUserProfile(token);
    },
    enabled: !!auth.userId,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  useEffect(() => {
    const refreshSession = async () => {
      if (session && !hasRefreshedSession.current) {
        hasRefreshedSession.current = true;
        await session.reload();
      }
    };

    refreshSession();
  }, [session]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background/50 z-50 absolute top-0 left-0">
        <LoadingSpinner />
      </div>
    );
  }

  return <>{children}</>;
};

export default AppLayout;
