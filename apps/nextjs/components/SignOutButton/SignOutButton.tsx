import { SignOutButton as ClerkSignOutButton } from "@clerk/nextjs";

import { Button } from "@workspace/ui/components/button";
import { LogOut } from "lucide-react";

const SignOutButton = () => {
  return (
    <ClerkSignOutButton>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center space-x-2 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
      >
        <LogOut className="w-4 h-4" />
      </Button>
    </ClerkSignOutButton>
  );
};

export default SignOutButton;
