import { UseFormReturn } from "react-hook-form";
import { SignInSchema } from "./schema";

export type SignInFormProps = {
  signInWithEmail: (data: SignInSchema) => void;
  form: UseFormReturn<SignInSchema>;
};
