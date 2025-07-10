import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

const page = () => {
  return <AuthenticateWithRedirectCallback signUpForceRedirectUrl={"/onboarding"} />;
};

export default page;
