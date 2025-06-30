"use client";
import { useSignIn } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import SigninForm from "@/components/SignInPage/SignInForm";
import { SignInSchema, signInSchema } from "@/lib/schema";

const Signin = () => {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();

  const form = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signInWithEmail = async (data: SignInSchema) => {
    if (!isLoaded) {
      return;
    }

    try {
      const result = await signIn.create({
        identifier: data.email,
        password: data.password,
      });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });

        router.push(result.pathRoot || "/");
        toast.success("Signed in successfully");
      } else {
        toast.error("Failed to sign in");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to sign in");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-900">
      <SigninForm signInWithEmail={signInWithEmail} form={form} />
    </div>
  );
};

export default Signin;
