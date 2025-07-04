"use client";

import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type AccountLayoutProps = {
  children: React.ReactNode;
};

const NAV_ITEMS: { label: string; href: string }[] = [
  { label: "Account", href: "/m/0/account" },
  { label: "Billing", href: "/m/0/account/billing" },
  { label: "Change Password", href: "/m/0/account/password" },
];

const toValue = (label: string) => label.toLowerCase().replace(/\s+/g, "-");

const AccountLayout = ({ children }: AccountLayoutProps) => {
  const pathname = usePathname();
  const activeTab = NAV_ITEMS.find((item) => pathname.startsWith(item.href))?.label ?? NAV_ITEMS[0]?.label;

  return (
    <div>
      <Tabs value={toValue(activeTab ?? "")} className="w-full">
        <TabsList variant={"outline"} className="flex">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} passHref>
              <TabsTrigger variant={"outline"} value={toValue(item.label)} className="justify-start">
                {item.label}
              </TabsTrigger>
            </Link>
          ))}
        </TabsList>
      </Tabs>

      <section className="md:col-span-3 w-full">{children}</section>
    </div>
  );
};

export default AccountLayout;
