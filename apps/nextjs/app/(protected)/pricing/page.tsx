import { auth } from "@clerk/nextjs/server";
import PricingSection from "@/components/LandingPage/PricingSection";

const page = async () => {
  const { userId } = await auth();

  const isAuthenticated = !!userId;

  return (
    <div className="min-h-screen flex items-center justify-center">
      <PricingSection isAuthenticated={isAuthenticated} />
    </div>
  );
};

export default page;
