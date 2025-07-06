"use client";

import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

type AccountLayoutProps = {
  children: React.ReactNode;
};

const NAV_ITEMS: { label: string; href: string }[] = [
  { label: "Account", href: "/m/0/account" },
  { label: "Billing", href: "/m/0/account/billing" },
  { label: "Change Password", href: "/m/0/account/change-password" },
];

const toValue = (label: string) => label.toLowerCase().replace(/\s+/g, "-");

const AccountLayout = ({ children }: AccountLayoutProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const activeLabel = NAV_ITEMS.find((item) => item.href === pathname)?.label ?? NAV_ITEMS[0]?.label;

  const handleTabChange = (label: string) => {
    const navItem = NAV_ITEMS.find((item) => item.label === label);
    if (navItem) {
      router.push(navItem.href);
    }
  };

  return (
    <div className="w-full">
      <Tabs value={toValue(activeLabel ?? "")} className="w-full">
        <TabsList variant="outline" className="flex">
          {NAV_ITEMS.map((item) => (
            <TabsTrigger
              key={item.label}
              variant="outline"
              value={toValue(item.label)}
              className="justify-start"
              onClick={() => handleTabChange(item.label)}
            >
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <section className="w-full py-4">{children}</section>
      </Tabs>
    </div>
  );
};

export default AccountLayout;
