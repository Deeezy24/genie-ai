"use client";

import { useAuth } from "@clerk/nextjs";
import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

type AccountLayoutProps = {
  children: React.ReactNode;
};

const toValue = (label: string) => label.toLowerCase().replace(/\s+/g, "-");

const AccountLayout = ({ children }: AccountLayoutProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const { sessionClaims } = useAuth();

  const NAV_ITEMS: { label: string; href: string }[] = [
    { label: "Account", href: `/m/${sessionClaims?.metadata.currentWorkspace}/account` },
    { label: "Billing", href: `/m/${sessionClaims?.metadata.currentWorkspace}/account/billing` },
    { label: "Change Password", href: `/m/${sessionClaims?.metadata.currentWorkspace}/account/change-password` },
  ];

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
