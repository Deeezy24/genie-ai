"use client";

import { useAuth } from "@clerk/nextjs";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { Separator } from "@workspace/ui/components/separator";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { TabsContent } from "@workspace/ui/components/tabs";
import { AlertCircle, Calendar, ChevronDown, FileX, Receipt } from "lucide-react";
import { useRouter } from "next/navigation";
import useUserHook from "@/hooks/useUserHook";
import { NAV_BG } from "@/lib/constant";
import { formatDate } from "@/lib/helper";
import { billingService } from "@/services/billing/billing-service";

const BillingPage = () => {
  const router = useRouter();
  const user = useUserHook();

  const { getToken } = useAuth();

  const subscriptionPlan = user?.subscription?.subscription_plan ?? "FREE";
  const subscriptionDate = user?.subscription?.subscription_date_created ?? "N/A";
  const isFreePlan = subscriptionPlan === "FREE";

  const {
    data: billingHistoryData,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["billing-history"],
    queryFn: async ({ pageParam = 1 }) => {
      const token = await getToken();
      return billingService.getBillingHistory({ token: token ?? "", page: pageParam, limit: 10 });
    },
    getNextPageParam: (lastPage, pages) => (lastPage.total > pages.length * 10 ? pages.length + 1 : undefined),
    initialPageParam: 1,
  });

  const billingHistory = billingHistoryData?.pages.flatMap((page) => page.data);

  const handleRedirect = async (url: string) => {
    router.push(url);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
      case "completed":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const BillingHistorySkeleton = () => (
    <div className="divide-y divide-gray-200">
      {[...Array(5)].map((_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey:just index
        <div key={index} className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-16" />
            </div>
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      ))}
    </div>
  );

  const EmptyBillingHistory = () => (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="p-4 bg-gray-100 rounded-full mb-4">
        <FileX className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">No billing history</h3>
      <p className="text-gray-500 text-center max-w-sm">
        {isFreePlan
          ? "Upgrade to a paid plan to start seeing your billing history here."
          : "Your billing history will appear here once you have transactions."}
      </p>
      {isFreePlan && (
        <Button onClick={() => router.push("/pricing")} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">
          View Plans
        </Button>
      )}
    </div>
  );

  const ErrorState = () => (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="p-4 bg-red-100 rounded-full mb-4">
        <AlertCircle className="w-8 h-8 text-red-500" />
      </div>
      <h3 className="text-lg font-semibold mb-2">Unable to load billing history</h3>
      <p className="text-center mb-4">There was an error loading your billing history. Please try again later.</p>
      <Button onClick={() => window.location.reload()} variant="outline" className="border-gray-300 hover:bg-gray-50">
        Retry
      </Button>
    </div>
  );

  return (
    <TabsContent value="billing" className="min-h-screen space-y-8 p-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold">Billing</h2>
      </div>

      <Separator className="bg-gray-200" />

      <section className="space-y-6">
        <h3 className="text-2xl font-bold">Billing Information</h3>

        <Card className={`${NAV_BG} w-full border-0 shadow-sm`}>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <span>Current Subscription</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-start">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="text-3xl font-bold">{isFreePlan ? "Free" : subscriptionPlan.toUpperCase()}</div>
                {!isFreePlan && <Badge className="bg-blue-100 text-blue-800 border-blue-200">Active</Badge>}
              </div>
              <p className="leading-relaxed">
                {isFreePlan
                  ? "You are currently on the Free Plan. Upgrade to unlock premium features and remove limitations."
                  : `Your next payment of ${subscriptionPlan} will be charged on ${formatDate(subscriptionDate)}.`}
              </p>
            </div>

            <Button
              onClick={() => router.push("/pricing")}
              className={`w-full font-medium ${
                isFreePlan
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                  : "bg-white border border-gray-300 hover:bg-gray-50 text-gray-700"
              }`}
            >
              {isFreePlan ? "Upgrade to Pro" : "Manage Subscription"}
            </Button>
          </CardContent>
        </Card>
      </section>

      <Separator className="bg-gray-200" />

      {/* Enhanced Billing History */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold">Billing History</h3>
            <p className="mt-1">
              {billingHistory?.length
                ? `${billingHistory.length} transaction${billingHistory.length > 1 ? "s" : ""}`
                : "Transaction history"}
            </p>
          </div>
        </div>

        <Card className={`${NAV_BG} border-0 shadow-sm`}>
          <CardContent className="p-0">
            {isError ? (
              <ErrorState />
            ) : (
              <ScrollArea className="h-[500px]">
                {isLoading ? (
                  <BillingHistorySkeleton />
                ) : !billingHistory || billingHistory.length === 0 ? (
                  <EmptyBillingHistory />
                ) : (
                  <>
                    <div className="divide-y divide-gray-100">
                      {billingHistory.map((data, index) => (
                        <div
                          key={data.subscription_payment_id}
                          className="p-6 hover:bg-gray-50/50 transition-colors group"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl group-hover:from-blue-100 group-hover:to-blue-150 transition-colors">
                                <Receipt className="w-5 h-5 text-blue-600" />
                              </div>
                              <div className="space-y-1">
                                <p className="font-semibold">
                                  {data.subscription_plan_name}
                                  <span className="font-normal ml-2">Monthly</span>
                                </p>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                  <Calendar className="w-3 h-3" />
                                  {formatDate(data.subscription_payment_date_created)}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-4">
                              <div className="text-right space-y-2">
                                <p className="font-bold text-lg">
                                  ₱{data.subscription_payment_amount.toLocaleString()}
                                </p>
                                <Badge
                                  className={`${getStatusColor(data.subscription_payment_status)} font-medium border`}
                                >
                                  {data.subscription_payment_status.toLowerCase()}
                                </Badge>
                              </div>
                              <Button
                                size="sm"
                                onClick={() => handleRedirect(data.subscription_payment_receipt_url)}
                                className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 shadow-sm"
                              >
                                <Receipt className="w-4 h-4 mr-1" />
                                Receipt
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Load More Button */}
                    {hasNextPage && (
                      <div className="p-4 border-t border-gray-100">
                        <Button
                          variant="outline"
                          className="w-full border-gray-200 hover:bg-gray-50"
                          onClick={() => fetchNextPage()}
                          disabled={isFetchingNextPage}
                        >
                          {isFetchingNextPage ? (
                            <>
                              <div className="w-4 h-4 mr-2 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
                              Loading...
                            </>
                          ) : (
                            <>
                              <ChevronDown className="w-4 h-4 mr-2" />
                              Load More Transactions
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </section>
    </TabsContent>
  );
};

export default BillingPage;
