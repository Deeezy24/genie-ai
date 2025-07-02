import { Card, CardContent } from "@workspace/ui/components/card";
import { motion } from "framer-motion";
import { UseFormRegister } from "react-hook-form";
import { itemVariants, listVariants } from "@/lib/framer-miotion";
import { FormValues } from "../OnBoardingPage";

type StepOneProps = {
  usageOptions: {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
  }[];
  selectedUsage: string;
  handleUsageSelect: (usageId: string) => void;
  register: UseFormRegister<FormValues>;
};

const StepOne = ({ usageOptions, selectedUsage, handleUsageSelect, register }: StepOneProps) => (
  <div className="space-y-8 flex flex-col items-center justify-center">
    <div className="text-center space-y-2">
      <h1 className="text-2xl font-semibold text-white">How did you hear about Geeni AI?</h1>
      <p className="text-gray-400">This helps us customize your experience</p>
    </div>

    <motion.div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 max-w-3xl" variants={listVariants}>
      {usageOptions.map((option) => (
        <motion.div key={option.id} variants={itemVariants}>
          <Card
            className={`cursor-pointer transition-all duration-200 border-2 bg-neutral-900/50 hover:bg-neutral-700/50 ${
              selectedUsage === option.id
                ? "border-neutral-700 bg-neutral-700/70"
                : "border-neutral-600 hover:border-neutral-500"
            }`}
            onClick={() => handleUsageSelect(option.id)}
            {...register("foundUsOn")}
          >
            <CardContent className="p-6 text-center space-y-4 min-h-[200px] flex flex-col justify-center">
              <div className="flex justify-center text-gray-300">{option.icon}</div>
              <div className="space-y-2">
                <h3 className="font-semibold text-white">{option.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{option.description}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  </div>
);

export default StepOne;
