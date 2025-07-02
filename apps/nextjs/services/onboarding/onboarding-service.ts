import { FormValues } from "@/components/OnBoardingPage/OnBoardingPage";
import { apiFetch } from "@/lib/config";

export const onboardingService = {
  createOnboarding: async (params: { data: FormValues; token: string | null }) => {
    const { data, token } = params;

    const response = await apiFetch<{ message: string }>("post", "/user/onboarding", data, token);

    return response;
  },
};
