import { Button } from "@workspace/ui/components/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const CallToAction = () => {
  return (
    <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join thousands of users who are already transforming their workflows with Genie AI.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button size="lg" asChild>
            <Link href="/sign-up">
              Start Your Free Trial
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
