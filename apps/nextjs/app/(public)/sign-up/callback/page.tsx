import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

const page = () => {
  return <AuthenticateWithRedirectCallback redirectUrl="/onboarding" />;
};

export default page;
