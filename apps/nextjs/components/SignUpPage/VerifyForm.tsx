import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@workspace/ui/components/form";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@workspace/ui/components/input-otp";
import { ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";
import { VerifySchema } from "@/lib/schema";

type VerifyFormProps = {
  handleVerify: (data: VerifySchema) => void;
  handleResendCode: () => void;
  form: UseFormReturn<VerifySchema>;
};

const VerifyForm = ({ handleVerify, handleResendCode, form }: VerifyFormProps) => {
  const { control, handleSubmit } = form;
  const [secondsLeft, setSecondsLeft] = useState(0);

  const onResendClick = async () => {
    handleResendCode();
    setSecondsLeft(10);
  };

  useEffect(() => {
    if (secondsLeft === 0) return;

    const tick = setInterval(() => {
      setSecondsLeft((s) => s - 1);
    }, 1_000);

    return () => clearInterval(tick);
  }, [secondsLeft]);

  return (
    <Card className="shadow-2xl bg-white/80 backdrop-blur-sm dark:bg-neutral-900/80 border-2">
      <CardHeader className="space-y-4">
        <div className="text-center space-y-2">
          <CardTitle className="text-2xl font-semibold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
            Verify your email
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            We've sent a verification code to your email address
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full mb-4">
            <Mail className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
            Enter the 6-digit code we sent to complete your registration
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={handleSubmit(handleVerify)} className="space-y-6">
            <FormField
              control={control}
              name="code"
              render={({ field }: { field: FieldValues }) => (
                <FormItem className="flex flex-col items-center justify-center">
                  <FormLabel htmlFor="code" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Verification Code
                  </FormLabel>
                  <FormControl>
                    <InputOTP onChange={field.onChange} maxLength={6}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full ">
              Complete Verification
            </Button>
          </form>
        </Form>

        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">Didn't receive the code?</p>
            <Button variant="outline" className="w-full" disabled={secondsLeft > 0} onClick={onResendClick}>
              {secondsLeft > 0 ? `Resend in ${secondsLeft}s` : "Resend Code"}
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span>or</span>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/sign-in"
              className="inline-flex items-center text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Sign In
            </Link>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-5 h-5 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
              </div>
            </div>
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <p className="font-medium mb-1">Security Notice</p>
              <p className="text-blue-700 dark:text-blue-300">
                This code expires in 10 minutes. Don't share it with anyone.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VerifyForm;
