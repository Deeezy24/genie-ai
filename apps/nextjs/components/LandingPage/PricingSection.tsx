import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card";

const pricingPlans = [
  {
    title: "Free",
    price: "$0",
    description: "Get started with basic features.",
    features: ["1 Workspace", "Basic AI Tools", "Community Support"],
    cta: "Get Started",
    highlight: false,
  },
  {
    title: "Monthly",
    price: "$19/mo",
    description: "Unlock premium features for individuals.",
    features: ["Unlimited Workspaces", "Advanced AI Tools", "Priority Support"],
    cta: "Start Monthly",
    highlight: true,
  },
  {
    title: "Yearly",
    price: "$190/yr",
    description: "Best value for teams and power users.",
    features: ["Everything in Monthly", "Team Collaboration", "Early Access to New Features"],
    cta: "Start Yearly",
    highlight: false,
  },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="container mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Choose the plan that fits your needs. No hidden fees, cancel anytime.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {pricingPlans.map((plan) => (
          <Card
            key={plan.title}
            className={`flex flex-col border-0 shadow-lg hover:shadow-xl transition-shadow ${plan.highlight ? "ring-2 ring-primary scale-105" : ""}`}
          >
            <CardHeader className="text-center">
              <CardTitle className="text-2xl mb-2">{plan.title}</CardTitle>
              <div className="text-4xl font-bold mb-2">{plan.price}</div>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center justify-center text-sm">
                    <span className="w-2 h-2 bg-primary rounded-full mr-2 inline-block" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="justify-center">
              <Button variant={plan.highlight ? "default" : "outline"}>{plan.cta}</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default PricingSection;
