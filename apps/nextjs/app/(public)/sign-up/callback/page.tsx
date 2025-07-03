import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

const page = () => {
  return <AuthenticateWithRedirectCallback signUpFallbackRedirectUrl="/dashboard" />;
};

export default page;
