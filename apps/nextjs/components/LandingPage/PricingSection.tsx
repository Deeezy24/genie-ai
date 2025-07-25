"use client";

import { useAuth } from "@clerk/nextjs";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { LoadingSpinner } from "@workspace/ui/components/loading-spinner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import useUserHook from "@/hooks/useUserHook";
import { CheckOutSchema } from "@/lib/schema";
import { checkOutService } from "@/services/check-out/check-out";

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
    cta: "Choose Basic",
    highlight: false,
    storeId: "201986",
    variantId: "908888",
    planId: "08b55fd4-f867-45c1-b350-ecbb34460a8c",
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
    cta: "Choose Pro",
    highlight: true,
    storeId: "201986",
    variantId: "902163",
    planId: "b507488f-95e2-4e58-9b33-c8df42a656b0",
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
    <section id="pricing" className="container mx-auto px-4 py-20">
      {isLoading && (
        <div className="min-h-screen w-full flex items-center justify-center bg-background/50 z-50 absolute top-0 left-0">
          <LoadingSpinner />
        </div>
      )}

      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Choose the plan that fits your needs. No hidden fees, cancel anytime.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-center items-stretch max-w-2xl mx-auto">
        {pricingPlans.map((plan) => {
          const isCurrentPlan = userPlan?.toLowerCase() === plan.title.toLowerCase();

          return (
            <Card
              key={plan.title}
              className={`flex flex-col border-0 shadow-lg hover:shadow-xl transition-shadow ${
                plan.highlight ? "ring-1 ring-primary scale-100" : " ring-1 ring-primary/20"
              }`}
            >
              <CardHeader className="text-center">
                <CardTitle className="text-2xl py-2">{plan.title}</CardTitle>
                <div className="text-4xl font-bold py-2">
                  {plan.price}
                  <span className="text-lg font-medium">/mo</span>
                </div>
                <CardDescription className="text-md py-2">{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="flex-1">
                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center justify-center text-md py-2">
                      <span className="w-2 h-2 bg-primary rounded-full mr-2 inline-block" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="justify-center">
                {isAuthenticated ? (
                  isCurrentPlan ? (
                    <Button disabled variant="secondary">
                      Your current plan
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
                      variant={plan.highlight ? "default" : "outline"}
                    >
                      {plan.cta}
                    </Button>
                  )
                ) : (
                  <Button asChild variant={plan.highlight ? "default" : "outline"}>
                    <Link href="/sign-up">{plan.cta}</Link>
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

export default PricingSection;
