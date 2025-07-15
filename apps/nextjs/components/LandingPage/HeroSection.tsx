import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="container mx-auto px-4 py-20 text-center">
      <Badge variant="secondary" className="mb-4">
        <Sparkles className="w-3 h-3 mr-1" />
        An AI Agent for your content essentials
      </Badge>
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
        An
        <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"> AI </span>
        for your writing needs
      </h1>
      <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
        Transform the way you write—summarize, paraphrase, and generate compelling content in seconds.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Button size="lg" asChild>
          <Link href="/sign-up">
            Start Free Trial
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;
