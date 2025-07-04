"use client";

import { useClerk } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { getInitials } from "@workspace/ui/lib/utils";
import { BadgeCheck, Bell, CreditCard, LogOut } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import { User } from "@/lib/types";

type Props = {
  user: User;
};

export function AccountSwitcher({ user }: Props) {
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();

    router.push("/sign-in");
  };

  const handlePushToLink = (link: string) => {
    router.push(link);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="size-9 rounded-lg">
          <AvatarImage src={user?.imageUrl || undefined} alt={user?.firstName || ""} />
          <AvatarFallback className="rounded-lg">{getInitials(user?.firstName || "")}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="min-w-56 space-y-1 rounded-lg" side="bottom" align="end" sideOffset={4}>
        {/* —–– user header —–– */}
        <div className="flex items-center gap-2 p-3">
          <Avatar className="size-9 rounded-lg">
            <AvatarImage src={user?.imageUrl || undefined} alt={user?.firstName || ""} />
            <AvatarFallback className="rounded-lg">{getInitials(user?.firstName || "")}</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left leading-tight">
            <span className="truncate font-semibold text-sm">{user?.firstName}</span>
            <span className="truncate text-xs capitalize">{user?.email}</span>
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* —–– menu items —–– */}
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => handlePushToLink("/m/0/account")}>
            <BadgeCheck className="mr-2 size-4" />
            Account
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handlePushToLink("/m/0/account/billing")}>
            <CreditCard className="mr-2 size-4" />
            Billing
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handlePushToLink("/m/0/notifications")}>
            <Bell className="mr-2 size-4" />
            Notifications
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 size-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
