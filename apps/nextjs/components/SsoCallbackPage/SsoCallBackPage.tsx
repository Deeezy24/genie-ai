"use client";

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

const SsoCallBackPage = () => {
  return <AuthenticateWithRedirectCallback signUpFallbackRedirectUrl="/sign-in" signInFallbackRedirectUrl="/sign-in" />;
};

export default SsoCallBackPage;
