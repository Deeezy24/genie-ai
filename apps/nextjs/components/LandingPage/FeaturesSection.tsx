import { Brain, Shield, Sparkles, Users, Zap } from "lucide-react";
import CardLandingPage from "../Reusable/CardLandingPage";

const FeaturesSection = () => {
  const LandingPageFeatures = [
    {
      icon: <Brain className="w-6 h-6 text-primary" />, // AI Insights
      title: "AI-Powered CV Insights",
      description: "Upload your CV and receive instant, actionable feedback powered by advanced AI analysis.",
      content: [
        "Automated skill gap detection",
        "Personalized improvement tips",
        "Highlight optimization for recruiters",
      ],
    },
    {
      icon: <Zap className="w-6 h-6 text-primary" />, // Fast Edits
      title: "Lightning-Fast Edits",
      description: "Get rapid, high-quality CV edits and suggestions tailored to your career goals.",
      content: [
        "Instant grammar and formatting fixes",
        "Role-specific keyword suggestions",
        "One-click content enhancements",
      ],
    },
    {
      icon: <Shield className="w-6 h-6 text-primary" />, // Data Security
      title: "Secure & Private",
      description: "Your CV data is encrypted and never shared. Privacy and security are our top priorities.",
      content: ["End-to-end encryption", "No data sharing with third parties", "GDPR compliant"],
    },
    {
      icon: <Users className="w-6 h-6 text-primary" />, // Collaboration
      title: "Collaborative Editing",
      description: "Invite mentors or peers to review and suggest edits to your CV in real time.",
      content: ["Shareable review links", "Comment and suggestion mode", "Version history tracking"],
    },
    {
      icon: <Sparkles className="w-6 h-6 text-primary" />, // Customization
      title: "Custom CV Templates",
      description: "Choose from a variety of modern, recruiter-approved templates and customize with ease.",
      content: ["Multiple design options", "Easy drag-and-drop sections", "ATS-friendly formatting"],
    },
    {
      icon: <Brain className="w-6 h-6 text-primary" />, // AI Matching
      title: "Job Matching AI",
      description: "Get matched to relevant job openings based on your CV and receive tailored application tips.",
      content: ["AI-driven job recommendations", "Application tracking", "Personalized cover letter suggestions"],
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
