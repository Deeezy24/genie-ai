import { Button } from "@workspace/ui/components/button";
import { Brain, Sparkles, Target, Zap } from "lucide-react";

const LandingPageFeatures = [
  {
    icon: <Sparkles className="w-8 h-8 text-primary" />,
    title: "AI-Powered Content Analysis",
    description:
      "Transform lengthy documents into concise, actionable summaries in seconds. Our advanced AI understands context and extracts key insights automatically, saving you hours of reading time.",
    benefits: ["Save 80% reading time", "Never miss important details", "Perfect for research & reports"],
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=600&h=400&q=80",
  },
  {
    icon: <Zap className="w-8 h-8 text-primary" />,
    title: "Lightning-Fast Generation",
    description:
      "Create professional-grade content instantly with our advanced language models. From emails to essays, generate polished text that matches your voice and style perfectly.",
    benefits: ["10x faster content creation", "Maintains your unique tone", "SEO-optimized output"],
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=600&h=400&q=80",
  },
  {
    icon: <Brain className="w-8 h-8 text-primary" />,
    title: "Intelligent Rewriting",
    description:
      "Enhance clarity, eliminate redundancy, and boost originality with smart paraphrasing. Perfect for academic work, marketing copy, and professional communications.",
    benefits: ["Plagiarism-free content", "Enhanced readability", "Multiple style variations"],
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&h=400&q=80",
  },
  {
    icon: <Target className="w-8 h-8 text-primary" />,
    title: "Precision Targeting",
    description:
      "Tailor your content for specific audiences with AI-driven insights. Optimize tone, complexity, and messaging for maximum impact and engagement rates.",
    benefits: ["Audience-specific optimization", "Higher engagement rates", "Better conversion metrics"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&h=400&q=80",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 bg-zinc-800/25 px-10">
      <div className="text-center mb-20 px-4">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-300 bg-clip-text text-transparent">
          Why Choose Genie AI?
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Transform your content creation workflow with cutting-edge AI technology. Experience the future of intelligent
          writing assistance designed for professionals who demand excellence.
        </p>
      </div>

      <div className="space-y-20 mb-16">
        {LandingPageFeatures.map((feature, index) => (
          <div
            key={feature.title}
            className={`flex flex-col lg:flex-row items-center gap-12 ${index % 2 === 1 ? "lg:flex-row-reverse" : ""}`}
          >
            {/* Content Side */}
            <div className="flex-1 space-y-6">
              <div className="flex items-center gap-4">
                <h3 className="text-3xl font-bold text-white">{feature.title}</h3>
              </div>

              <p className="text-lg text-gray-300 leading-relaxed">{feature.description}</p>

              <div className="space-y-3">
                {feature.benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span className="text-gray-200 font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Image Side */}
            <div className="flex-1 relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-blue-500/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative overflow-hidden rounded-2xl shadow-2xl group-hover:shadow-primary/20 transition-all duration-300 group-hover:-translate-y-2 border border-white/10">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                {/* Floating Icon */}
                <div className="absolute top-6 right-6 p-3 bg-black/60 backdrop-blur-sm rounded-lg shadow-lg border border-white/20">
                  {feature.icon}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA Section */}
      <div className="text-center bg-white/5 backdrop-blur-sm rounded-2xl p-12 shadow-xl border border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-blue-500/10 to-purple-500/10" />
        <div className="relative">
          <h3 className="text-3xl font-bold mb-4 text-white">Ready to 10x Your Content Creation?</h3>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who've already transformed their workflow with Genie AI. Start your free
            trial today and experience the difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary">Start Free Trial</Button>
            <Button variant="secondary">Watch Demo</Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
