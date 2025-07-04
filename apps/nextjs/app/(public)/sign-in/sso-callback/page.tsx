import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

const page = () => {
  // Handle the redirect flow by calling the Clerk.handleRedirectCallback() method
  // or rendering the prebuilt <AuthenticateWithRedirectCallback/> component.
  // This is the final step in the custom OAuth flow.
  return <AuthenticateWithRedirectCallback />;
};

export default page;
