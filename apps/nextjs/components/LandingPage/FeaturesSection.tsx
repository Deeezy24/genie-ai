import { Brain, Sparkles, Zap } from "lucide-react";
import CardLandingPage from "../Reusable/CardLandingPage";

const LandingPageFeatures = [
  {
    icon: <Sparkles className="w-6 h-6 text-primary" />,
    title: "Instant Summaries",
    description: "Get the gist of any content with one click!",
  },
  {
    icon: <Zap className="w-6 h-6 text-primary" />,
    title: "Effortless Paragraphs",
    description:
      "Generate well-crafted paragraphs effortlessly with a click. Your go-to tool for seamless content creation!",
  },
  {
    icon: <Brain className="w-6 h-6 text-primary" />,
    title: "Smart Paraphrasing",
    description:
      "Instantly rephrase sentences for clarity and originality—perfect for avoiding repetition and boosting creativity.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="container mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Genie AI?</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Empower your workflow with advanced AI features that make writing faster, smarter, and more enjoyable.
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {LandingPageFeatures.map((feature) => (
          <CardLandingPage
            key={feature.title}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
