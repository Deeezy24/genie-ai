import { Brain, Shield, Sparkles, Users, Zap } from "lucide-react";
import CardLandingPage from "../Reusable/CardLandingPage";

const FeaturesSection = () => {
  const LandingPageFeatures = [
    {
      icon: <Brain className="w-6 h-6 text-primary" />,
      title: "Intelligent Automation",
      description: "Automate complex tasks with AI that learns and adapts to your specific workflow requirements.",
      content: ["Smart task recognition", "Adaptive learning algorithms", "Seamless integration"],
    },
    {
      icon: <Zap className="w-6 h-6 text-primary" />,
      title: "Lightning Fast",
      description:
        "Experience blazing-fast performance with optimized AI models and real-time processing capabilities.",
      content: ["Real-time processing", "Optimized algorithms", "Instant responses"],
    },
    {
      icon: <Shield className="w-6 h-6 text-primary" />,
      title: "Enterprise Security",
      description: "Your data is protected with enterprise-grade security and compliance standards.",
      content: ["End-to-end encryption", "SOC 2 compliance", "Regular security audits"],
    },
    {
      icon: <Users className="w-6 h-6 text-primary" />,
      title: "Team Collaboration",
      description: "Work together seamlessly with AI-powered collaboration tools and shared workspaces.",
      content: ["Shared workspaces", "Real-time collaboration", "Role-based access"],
    },
    {
      icon: <Sparkles className="w-6 h-6 text-primary" />,
      title: "Advanced Analytics",
      description: "Gain deep insights with AI-powered analytics and predictive modeling capabilities.",
      content: ["Predictive insights", "Custom dashboards", "Data visualization"],
    },
    {
      icon: <Brain className="w-6 h-6 text-primary" />,
      title: "Custom AI Models",
      description: "Train and deploy custom AI models tailored to your specific business needs and use cases.",
      content: ["Custom training", "Model deployment", "Performance monitoring"],
    },
  ];

  return (
    <section id="features" className="container mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Cover Genie?</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Experience the future of AI with our cutting-edge features designed to enhance productivity and drive
          innovation.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {LandingPageFeatures.map((feature) => (
          <CardLandingPage
            key={feature.title}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            content={feature.content}
          />
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
