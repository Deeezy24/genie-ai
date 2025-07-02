"use client";

import { useAuth } from "@clerk/nextjs";
import { AnimatePresence, motion } from "framer-motion";
import {
  Book,
  Briefcase,
  Building2,
  Calendar,
  CheckSquare,
  Circle,
  DollarSign,
  Facebook,
  Globe,
  GraduationCap,
  Home,
  ListTodo,
  MapPin,
  Megaphone,
  Search,
  User,
  Users,
  Utensils,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { pageVariants } from "@/lib/framer-miotion";
import { onboardingService } from "@/services/onboarding/onboarding-service";
import StepOne from "./OnboardingSteps/StepOne";
import StepThree from "./OnboardingSteps/StepThree";
import StepTwo from "./OnboardingSteps/StepTwo";

export type FormValues = {
  foundUsOn: string;
  purpose: string;
  interests: string[];
};

const OnBoardingPage = () => {
  const router = useRouter();
  const { getToken } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedUsage, setSelectedUsage] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const form = useForm<FormValues>({
    defaultValues: {
      foundUsOn: "",
      purpose: "",
      interests: [],
    },
  });

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const heardUsOptions = [
    {
      id: "facebook",
      title: "Facebook",
      description: "Saw a post, story, or ad",
      icon: <Facebook className="w-8 h-8" />,
    },
    {
      id: "google",
      title: "Google Search",
      description: "Found you via search results",
      icon: <Search className="w-8 h-8" />,
    },
    {
      id: "friend",
      title: "Friend / colleague",
      description: "Word of mouth recommendation",
      icon: <Users className="w-8 h-8" />,
    },
    {
      id: "online-ad",
      title: "Online ad",
      description: "Banner, PPC, or display network",
      icon: <Megaphone className="w-8 h-8" />,
    },
    {
      id: "social-other",
      title: "Other social platform",
      description: "Instagram, TikTok, X, etc.",
      icon: <Globe className="w-8 h-8" />,
    },
    {
      id: "other",
      title: "Something else",
      description: "Podcast, event, flyer…",
      icon: <Circle className="w-8 h-8" />,
    },
  ];

  const purposeOptions = [
    {
      id: "work",
      title: "For work",
      description: "Track projects, company goals, meeting notes",
      icon: <Building2 className="w-6 h-6" />,
    },
    {
      id: "personal",
      title: "For personal life",
      description: "Write better, think more clearly, stay organized",
      icon: <Home className="w-6 h-6" />,
    },
    {
      id: "school",
      title: "For school",
      description: "Keep notes, research, and tasks in one place",
      icon: <GraduationCap className="w-6 h-6" />,
    },
  ];

  const interestOptions = [
    { id: "personal-finance", label: "Personal finance", icon: <DollarSign className="w-4 h-4" /> },
    { id: "habit-tracking", label: "Habit tracking", icon: <CheckSquare className="w-4 h-4" /> },
    { id: "hobbies", label: "Hobbies", icon: <User className="w-4 h-4" /> },
    { id: "travel", label: "Travel", icon: <MapPin className="w-4 h-4" /> },
    { id: "site-blog", label: "Site or blog", icon: <Book className="w-4 h-4" /> },
    { id: "books-media", label: "Books and media", icon: <Book className="w-4 h-4" /> },
    { id: "project-tracking", label: "Project tracking", icon: <Calendar className="w-4 h-4" /> },
    { id: "food-nutrition", label: "Food & nutrition", icon: <Utensils className="w-4 h-4" /> },
    { id: "todo-list", label: "To-do list", icon: <ListTodo className="w-4 h-4" /> },
    { id: "career-building", label: "Career building", icon: <Briefcase className="w-4 h-4" /> },
  ];

  const handleContinue = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleUsageSelect = (usageId: string) => {
    setSelectedUsage(usageId);
    form.setValue("foundUsOn", usageId);
    handleContinue();
  };

  const handlePurposeSelect = (purposeId: string) => {
    setSelectedUsage(purposeId);
    form.setValue("purpose", purposeId);
    handleContinue();
  };

  const handleInterestToggle = (interestId: string) => {
    const next = selectedInterests.includes(interestId)
      ? selectedInterests.filter((id) => id !== interestId)
      : [...selectedInterests, interestId];

    setSelectedInterests(next);
    form.setValue("interests", next as never[]);
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const token = await getToken();

      await onboardingService.createOnboarding({ data, token });

      toast.success("Onboarding created successfully");

      router.push("/dashboard");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message ?? "Something went wrong");
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 overflow-hidden">
      <div className="w-full max-w-4xl relative">
        <form onSubmit={handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div key="step-1" variants={pageVariants} initial="initial" animate="animate" exit="exit">
                <StepOne
                  usageOptions={heardUsOptions}
                  selectedUsage={selectedUsage}
                  handleUsageSelect={handleUsageSelect}
                  register={register}
                />
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div key="step-2" variants={pageVariants} initial="initial" animate="animate" exit="exit">
                <StepTwo
                  purposeOptions={purposeOptions}
                  selectedUsage={selectedUsage}
                  handlePurposeSelect={handlePurposeSelect}
                  register={register}
                />
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div key="step-3" variants={pageVariants} initial="initial" animate="animate" exit="exit">
                <StepThree
                  selectedInterests={selectedInterests}
                  interestOptions={interestOptions}
                  handleInterestToggle={handleInterestToggle}
                  register={register}
                  isSubmitting={isSubmitting}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </div>
  );
};

export default OnBoardingPage;
