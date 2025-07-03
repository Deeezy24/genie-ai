import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

const page = () => {
  return (
    <AuthenticateWithRedirectCallback signUpFallbackRedirectUrl="/onboarding" signInFallbackRedirectUrl="/dashboard" />
  );
};

export default page;
