"use client";

import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Separator } from "@workspace/ui/components/separator";
import { TabsContent } from "@workspace/ui/components/tabs";
import { Edit3, Mail, User } from "lucide-react";
import Link from "next/link";
import { NAV_BG, SEP, TXT_PRIMARY, TXT_SECONDARY } from "@/lib/constant";

const AccountPage = () => {
  const { user } = useUser();

  const getInitials = (first?: string, last?: string) => `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase();

  return (
    <TabsContent value="account" className="container mx-auto space-y-6">
      <Card className={NAV_BG}>
        <CardHeader>
          <div className="flex gap-6">
            <Avatar className="h-24 w-24 border-2 border-teal-500">
              <AvatarImage src={user?.imageUrl ?? ""} alt={user?.fullName ?? "User avatar"} />
              <AvatarFallback className="bg-teal-500 text-white text-xl font-semibold">
                {getInitials(user?.firstName ?? "", user?.lastName ?? "")}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className={`text-2xl ${TXT_PRIMARY}`}>
                    {user?.firstName} {user?.lastName}
                  </CardTitle>
                  <CardDescription className={TXT_SECONDARY}>{user?.emailAddresses?.[0]?.emailAddress}</CardDescription>
                </div>

                <Link href="/additional">
                  <Button
                    className="bg-zinc-700 hover:bg-zinc-600 text-white dark:bg-zinc-600 dark:hover:bg-zinc-500"
                    size="sm"
                  >
                    <Edit3 className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* ───── Info Cards ───── */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Personal Information */}
        <Card className={NAV_BG}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${TXT_PRIMARY}`}>
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
            <CardDescription className={TXT_SECONDARY}>Your basic profile information</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid gap-3">
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${TXT_SECONDARY}`}>First Name</span>
                <span className={`text-sm ${TXT_PRIMARY}`}>{user?.firstName || "Not set"}</span>
              </div>
              <Separator className={SEP} />

              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${TXT_SECONDARY}`}>Last Name</span>
                <span className={`text-sm ${TXT_PRIMARY}`}>{user?.lastName || "Not set"}</span>
              </div>
              <Separator className={SEP} />
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className={NAV_BG}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${TXT_PRIMARY}`}>
              <Mail className="h-5 w-5" />
              Contact Information
            </CardTitle>
            <CardDescription className={TXT_SECONDARY}>Your email addresses and contact details</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex flex-col gap-2">
                <span className={`text-sm font-medium ${TXT_SECONDARY}`}>Email Addresses</span>
                <div className="flex flex-wrap gap-2">
                  {user?.emailAddresses?.map((e) => (
                    <Badge
                      key={e.emailAddress}
                      variant="secondary"
                      className="bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-zinc-700 dark:text-gray-300 dark:hover:bg-zinc-600"
                    >
                      {e.emailAddress}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  );
};

export default AccountPage;
