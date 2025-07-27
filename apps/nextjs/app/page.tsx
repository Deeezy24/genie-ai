import FeaturesSection from "@/components/LandingPage/FeaturesSection";
import ChatInterfaceSection from "@/components/LandingPage/FileUploadSection";
import Footer from "@/components/LandingPage/Footer";
import HeaderComponent from "@/components/LandingPage/HeaderComponent";
import HeroSection from "@/components/LandingPage/HeroSection";
import PricingSection from "@/components/LandingPage/PricingSection";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header Section */}
      <HeaderComponent />

      {/* Hero Section */}
      <HeroSection />

      {/* File Upload Section */}
      <ChatInterfaceSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Pricing Section */}
      <PricingSection />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
