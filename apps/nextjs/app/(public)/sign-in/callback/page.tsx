import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

const page = () => {
  return <AuthenticateWithRedirectCallback signInFallbackRedirectUrl="/dashboard" />;
};

export default page;
