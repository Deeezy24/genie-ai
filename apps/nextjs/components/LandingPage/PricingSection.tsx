"use client";

import { useAuth } from "@clerk/nextjs";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { LoadingSpinner } from "@workspace/ui/components/loading-spinner";
import { Check, Crown, Shield } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import useUserHook from "@/hooks/useUserHook";
import { CheckOutSchema } from "@/lib/schema";
import { checkOutService } from "@/services/check-out/check-out-service";

const pricingPlans = [
  {
    title: "Basic",
    price: "$4",
    description: "Perfect for individuals who want to boost their writing with AI.",
    features: [
      "Summarize any text instantly",
      "Generate well-crafted paragraphs",
      "Smart paraphrasing tools",
      "Access to basic AI features",
      "Standard support",
    ],
    cta: "Start with Basic",
    highlight: false,
    storeId: "201986",
    variantId: "908888",
    planId: "08b55fd4-f867-45c1-b350-ecbb34460a8c",
    monthlyQuota: "300 words",
  },
  {
    title: "Pro",
    price: "$7",
    description: "Advanced tools for professionals and content creators.",
    features: [
      "All Basic features included",
      "Unlimited content generation",
      "Creative content suggestions",
      "Tone & style adjustment",
      "Priority support",
    ],
    cta: "Go Pro Now",
    highlight: true,
    storeId: "201986",
    variantId: "902163",
    planId: "b507488f-95e2-4e58-9b33-c8df42a656b0",
    icon: <Crown className="w-6 h-6" />,
    badge: "Most Popular",
    monthlyQuota: "Unlimited",
    support: "Priority support",
  },
];

const PricingSection = ({ isAuthenticated = false }: { isAuthenticated?: boolean }) => {
  const router = useRouter();
  const user = useUserHook();
  const [isLoading, setIsLoading] = useState(false);

  const { getToken } = useAuth();

  const userPlan = user?.subscription?.subscription_plan as string;

  const handleCheckOut = async (data: CheckOutSchema) => {
    try {
      if (!isAuthenticated) return;
      setIsLoading(true);
      const token = await getToken();

      if (!token) return;

      const response = await checkOutService.getCheckOutUrl({ data, token });

      router.push(response.checkoutUrl);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="pricing" className="relative bg-gradient-to-b from-zinc-800/25 to-black/40 py-24 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

      {isLoading && (
        <div className="min-h-screen w-full flex items-center justify-center bg-background/50 z-50 fixed top-0 left-0">
          <LoadingSpinner />
        </div>
      )}

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-300 bg-clip-text text-transparent">
            Choose Your Plan
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
            Unlock the full potential of AI-powered writing. No hidden fees, cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-center items-stretch max-w-4xl mx-auto mb-16">
          {pricingPlans.map((plan) => {
            const isCurrentPlan = userPlan?.toLowerCase() === plan.title.toLowerCase();

            return (
              <div key={plan.title} className="relative group">
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${
                    plan.highlight ? "from-primary/30 to-blue-500/30" : "from-gray-500/20 to-gray-400/20"
                  } rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

                <Card
                  className={`relative flex flex-col bg-white/5 backdrop-blur-sm border transition-all duration-300 hover:-translate-y-2 ${
                    plan.highlight
                      ? "border-primary/50 shadow-primary/20 shadow-2xl"
                      : "border-white/10 hover:border-white/20"
                  }`}
                >
                  <CardHeader className="text-center">
                    <div className="flex items-center justify-center">
                      <CardTitle className="text-2xl text-white">{plan.title}</CardTitle>
                    </div>

                    <div className="text-5xl font-bold">
                      <span className="text-lg font-medium text-gray-400">{plan.price}/mo</span>
                    </div>
                    <CardDescription className="text-gray-300 text-base">{plan.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="flex-1 px-6">
                    <div
                      className={`grid ${plan.support ? "grid-cols-2" : "grid-cols-1"} gap-4 mb-6 p-4 bg-white/5 rounded-lg`}
                    >
                      <div className="text-center">
                        <div className="text-sm text-gray-400">Monthly Quota</div>
                        <div className="font-semibold text-white">{plan.monthlyQuota}</div>
                      </div>
                      {plan.support && (
                        <div className="text-center">
                          <div className="text-sm text-gray-400">Support</div>
                          <div className="font-semibold text-white">{plan.support}</div>
                        </div>
                      )}
                    </div>

                    <ul className="space-y-4">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <div className="p-1 bg-green-500/20 rounded-full mt-0.5">
                            <Check className="w-3 h-3 text-green-400" />
                          </div>
                          <span className="text-gray-300 text-sm leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter className="pt-6">
                    {isAuthenticated ? (
                      isCurrentPlan ? (
                        <Button disabled variant="secondary" className="w-full bg-white/10 text-white">
                          <Shield className="w-4 h-4 mr-2" />
                          Your Current Plan
                        </Button>
                      ) : (
                        <Button
                          onClick={() =>
                            handleCheckOut({
                              email: user?.email ?? "",
                              name: user?.fullName ?? "",
                              variantId: plan.variantId,
                              productName: plan.title,
                              planId: plan.planId,
                              storeId: plan.storeId,
                            })
                          }
                          className={`w-full font-semibold transition-all duration-200 hover:scale-105`}
                        >
                          {plan.cta}
                        </Button>
                      )
                    ) : (
                      <Button
                        asChild
                        className={`w-full font-semibold transition-all duration-200 hover:scale-105 ${
                          plan.highlight
                            ? "bg-white text-black shadow-lg"
                            : "bg-white/10 hover:bg-white/20 text-white border border-white/20"
                        }`}
                      >
                        <Link href="/sign-up">{plan.cta}</Link>
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
