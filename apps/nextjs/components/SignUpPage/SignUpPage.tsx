"use client";

import { useSignUp } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { SignUpSchema, signUpSchema, VerifySchema, verifySchema } from "@/lib/schema";
import SignupForm from "./SignUpForm";
import VerifyForm from "./VerifyForm";

const Signup = () => {
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();

  const [verifying, setVerifying] = useState(false);

  const signupForm = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
    },
  });

  const verifyForm = useForm<VerifySchema>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  });

  const signUpWithEmail = async (data: SignUpSchema) => {
    if (!isLoaded) return;

    try {
      await signUp.create({
        emailAddress: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        unsafeMetadata: {
          metadata: { onboardingComplete: false },
        },
      });

      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      setVerifying(true);
    } catch (err: unknown) {
      if (err instanceof Error) toast.error(err.message);
      else toast.error("An unknown error occurred");
    }
  };

  const handleResendCode = async () => {
    if (!isLoaded) return;

    try {
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      toast.success("Code resent to email");
    } catch (err: unknown) {
      if (err instanceof Error) toast.error(err.message);
      else toast.error("An unknown error occurred");
    }
  };

  const handleVerify = async (data: VerifySchema) => {
    if (!isLoaded) return;

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: data.code,
      });

      if (completeSignUp.status !== "complete") {
        toast.error("Verification incomplete");
        return;
      }

      await setActive({ session: completeSignUp.createdSessionId });
      router.push("/onboarding");
    } catch (err: any) {
      toast.error(err?.message || "Verification failed");
    }
  };

  const handleGoogleSignUp = async () => {
    if (!isLoaded) return;

    try {
      await signUp.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sign-in/sso-callback",
        redirectUrlComplete: "/onboarding",
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
      } else {
        toast.error("Failed to sign up");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      {!verifying ? (
        <SignupForm signUpThruGoogle={handleGoogleSignUp} signUpWithEmail={signUpWithEmail} form={signupForm} />
      ) : (
        <VerifyForm handleVerify={handleVerify} handleResendCode={handleResendCode} form={verifyForm} />
      )}
    </div>
  );
};

export default Signup;
