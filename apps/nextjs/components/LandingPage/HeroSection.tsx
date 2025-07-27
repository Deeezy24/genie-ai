import { Button } from "@workspace/ui/components/button";
import { ArrowRight, CheckCircle, Play, Sparkles, Zap } from "lucide-react";

const HeroSection = () => {
  const heading = "writing needs";

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-zinc-900 via-black to-zinc-800 min-h-screen flex items-center justify-center">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80" />

      <div className="relative container mx-auto px-4 pt-32 pb-20">
        <div className="text-center max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 leading-[1.1]">
            An{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-primary via-primary to-primary/60 bg-clip-text text-transparent">
                AI
              </span>
            </span>{" "}
            for your{" "}
            <span className="relative">
              writing needs
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 rounded-full" />
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
            Transform the way you write—summarize, paraphrase, and generate compelling content in seconds.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="border-border hover:bg-accent px-8 py-6 text-lg rounded-xl transition-all duration-300 hover:scale-105 group"
            >
              <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
              Watch Demo
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-muted-foreground">
            {/* <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 border-2 border-background flex items-center justify-center">
                  <Users className="w-4 h-4 text-primary" />
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-primary/50 border-2 border-background" />
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 border-2 border-background" />
              </div>
            </div> */}

            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <span>Generate content in seconds</span>
            </div>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            {
              icon: <Sparkles className="w-6 h-6 text-primary" />,
              title: "AI-Powered Writing",
              description: "Generate high-quality content with advanced AI technology",
            },
            {
              icon: <Zap className="w-6 h-6 text-primary" />,
              title: "Lightning Fast",
              description: "Create compelling content in seconds, not hours",
            },
            {
              icon: <CheckCircle className="w-6 h-6 text-primary" />,
              title: "Always Accurate",
              description: "Get reliable, fact-checked content every time",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="text-center p-6 rounded-2xl border border-border/50 bg-background/50 backdrop-blur-sm hover:border-border transition-all duration-300 hover:scale-105"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
