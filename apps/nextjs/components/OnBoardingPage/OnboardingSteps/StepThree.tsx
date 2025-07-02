import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { UseFormRegister } from "react-hook-form";
import { itemVariants, listVariants } from "@/lib/framer-miotion";
import { FormValues } from "../OnBoardingPage";

type StepThreeProps = {
  selectedInterests: string[];
  interestOptions: {
    id: string;
    label: string;
    icon: React.ReactNode;
  }[];
  handleInterestToggle: (interestId: string) => void;
  register: UseFormRegister<FormValues>;
  isSubmitting: boolean;
};

const StepThree = ({
  selectedInterests,
  interestOptions,
  handleInterestToggle,
  register,
  isSubmitting,
}: StepThreeProps) => (
  <div className="space-y-8">
    <div className="text-center space-y-2">
      <h1 className="text-2xl font-semibold text-white">What's on your mind?</h1>
      <p className="text-gray-400">Select as many as you want.</p>
    </div>

    <div className="max-w-2xl mx-auto">
      <motion.div className="flex flex-wrap gap-3" variants={listVariants} initial="initial" animate="animate">
        {interestOptions.map((interest) => (
          <motion.div key={interest.id} variants={itemVariants}>
            <Badge
              variant={selectedInterests.includes(interest.id) ? "default" : "outline"}
              className={`cursor-pointer transition-all duration-200 px-4 py-2 text-sm ${
                selectedInterests.includes(interest.id)
                  ? "bg-neutral-700 hover:bg-neutral-600 text-white border-neutral-600"
                  : "bg-neutral-900 hover:bg-neutral-700 text-neutral-300 border-neutral-600 hover:border-neutral-500"
              }`}
              onClick={() => handleInterestToggle(interest.id)}
              {...register("interests")}
            >
              <span className="mr-2">{interest.icon}</span>
              {interest.label}
            </Badge>
          </motion.div>
        ))}
      </motion.div>
    </div>

    <div className="flex justify-center">
      <div className="w-64 h-32 opacity-50">
        {/** biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
        <svg viewBox="0 0 200 100" className="w-full h-full" aria-label="Onboarding page">
          <path d="M20,50 Q50,20 80,50 T140,50 T200,50" stroke="white" strokeWidth="2" fill="none" opacity="0.3" />
          <circle cx="30" cy="50" r="20" fill="gray" opacity="0.6" />
          <circle cx="50" cy="35" r="8" fill="red" />
          <circle cx="70" cy="45" r="6" fill="blue" />
          <circle cx="90" cy="55" r="10" fill="yellow" />
          <circle cx="110" cy="40" r="7" fill="green" />
          <circle cx="130" cy="50" r="9" fill="orange" />
          <circle cx="150" cy="45" r="8" fill="purple" />
          <circle cx="170" cy="55" r="6" fill="pink" />
        </svg>
      </div>
    </div>

    <div className="flex justify-center">
      <Button type="submit" variant="secondary" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Continue"}
      </Button>
    </div>
  </div>
);

export default StepThree;
