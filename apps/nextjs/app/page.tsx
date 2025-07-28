import ChatInterfaceSection from "@/components/LandingPage/ChatInterfaceSection";
import FeaturesSection from "@/components/LandingPage/FeaturesSection";
import Footer from "@/components/LandingPage/Footer";
import HeaderComponent from "@/components/LandingPage/HeaderComponent";
import HeroSection from "@/components/LandingPage/HeroSection";
import PricingSection from "@/components/LandingPage/PricingSection";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <HeaderComponent />

      <HeroSection />

      <ChatInterfaceSection />

      <FeaturesSection />

      <PricingSection />

      <Footer />
    </div>
  );
};

export default LandingPage;
