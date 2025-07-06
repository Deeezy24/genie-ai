/* app/(m)/0/account/ChangePasswordPage.tsx
   ─────────────────────────────────────── */
"use client";

import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Separator } from "@workspace/ui/components/separator";
import { TabsContent } from "@workspace/ui/components/tabs";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { INPUT_BG, NAV_BG, SEP } from "@/lib/constant";
import { ChangePasswordSchema, changePasswordSchema } from "@/lib/schema";

const ChangePasswordPage = () => {
  const { user } = useUser();
  const form = useForm<ChangePasswordSchema>({ resolver: zodResolver(changePasswordSchema) });
  const { handleSubmit, reset } = form;

  const onSubmit = async (values: ChangePasswordSchema) => {
    try {
      await user?.updatePassword({
        newPassword: values.newPassword,
        ...(values.currentPassword ? { currentPassword: values.currentPassword } : {}),
        signOutOfOtherSessions: true,
      });

      toast.success("Password updated successfully");
      reset();
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      }
    }
  };

  return (
    <TabsContent value="change-password">
      <Card className={NAV_BG}>
        <CardHeader>
          <CardTitle className="text-xl">Change Password</CardTitle>
        </CardHeader>

        <Separator className={SEP} />

        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current password</FormLabel>
                    <FormControl>
                      <Input
                        id="currentPassword"
                        type="password"
                        autoComplete="current-password"
                        {...field}
                        className={INPUT_BG}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New password</FormLabel>
                    <FormControl>
                      <Input
                        id="newPassword"
                        type="password"
                        autoComplete="new-password"
                        {...field}
                        className={INPUT_BG}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Confirm password */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm password</FormLabel>
                    <FormControl>
                      <Input
                        id="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        {...field}
                        className={INPUT_BG}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
                {form.formState.isSubmitting ? "Updating…" : "Update password"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default ChangePasswordPage;
