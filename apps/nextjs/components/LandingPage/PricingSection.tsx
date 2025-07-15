import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card";
import Link from "next/link";

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-center items-stretch max-w-2xl mx-auto">
        {pricingPlans.map((plan) => (
          <Card
            key={plan.title}
            className={`flex flex-col border-0 shadow-lg hover:shadow-xl transition-shadow ${plan.highlight ? "ring-1 ring-primary scale-100" : ""}`}
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
              <Button asChild variant={plan.highlight ? "default" : "outline"}>
                <Link href="/sign-up">{plan.cta}</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default PricingSection;
