"use client";

import { useUser } from "@clerk/nextjs";
import SignOutButton from "../SignOutButton/SignOutButton";

const UserWelcome = () => {
  const { user } = useUser();

  if (!user) return null;

  return (
    <div className="flex items-center justify-between h-16">
      <div className="flex items-center space-x-3">
        <h1 className="text-xl font-semibold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
          Welcome {user.firstName} {user.lastName}
        </h1>
      </div>
      <div className="flex items-center space-x-6">
        <SignOutButton />
      </div>
    </div>
  );
};

export default UserWelcome;
