"use client";

import { useAuth } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@workspace/ui/components/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select";
import { Slider } from "@workspace/ui/components/slider";
import { Textarea } from "@workspace/ui/components/textarea";
import { AxiosError } from "axios";
import { Loader2, Upload } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { GenieTextTypes, genieTextSchema } from "@/lib/schema";
import { GenieTypes } from "@/lib/types";
import { summaryService } from "@/services/summary/summary-service";

const TextTab = ({ workspace, type }: { workspace: string; type: GenieTypes }) => {
  const { getToken } = useAuth();

  const [summary, setSummary] = useState<string>("");
  const [displayedSummary, setDisplayedSummary] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const form = useForm<GenieTextTypes>({
    resolver: zodResolver(genieTextSchema),
    defaultValues: {
      summaryLength: 25,
      inputText: "",
      summaryTone: "Simple",
      summaryType: type,
      workspaceId: workspace,
    },
  });

  const {
    formState: { isValid, isSubmitting },
  } = form;

  const onSubmit = async (data: GenieTextTypes) => {
    try {
      const token = await getToken();
      const { data: summaryData } = await summaryService.createSummary({
        data,
        token,
      });

      setSummary(summaryData);
      setDisplayedSummary("");
      setIsTyping(true);

      let i = 0;
      const interval = setInterval(() => {
        setDisplayedSummary((prev) => prev + summaryData.charAt(i));
        i++;
        if (i >= summaryData.length) {
          clearInterval(interval);
          setIsTyping(false);
        }
      }, 20);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
    }
  };

  return (
    <div className="flex gap-4 bg-muted rounded-md">
      <Card className="bg-muted w-full flex-3/5 shadow-none">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader className="hidden">
              <CardTitle className="text-white flex items-center justify-between">Text</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">{type.charAt(0).toUpperCase() + type.slice(1)}</h2>
                <div className="flex items-center gap-4">
                  <FormField
                    control={form.control}
                    name="summaryTone"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger className="rounded-full px-4 py-1 dark:bg-neutral-900">
                              <SelectValue placeholder="Select a summary mode" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Simple">Simple</SelectItem>
                              <SelectItem value="Detailed">Detailed</SelectItem>
                              <SelectItem value="Bullet Points">Bullet Points</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="summaryLength"
                    render={({ field }) => (
                      <div className="flex items-center gap-2 bg-neutral-900 rounded-full px-4 py-1">
                        <span className="text-sm font-medium text-white">Shorter</span>
                        <Slider
                          value={[field.value]}
                          onValueChange={(val) => field.onChange(val[0])}
                          min={25}
                          max={75}
                          step={25}
                          className="w-40"
                        />
                        <span className="text-sm font-medium text-white">Longer</span>
                      </div>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name="inputText"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        className="min-h-96 border-2 border-muted-foreground"
                        placeholder="Describe what is the best way to summarize the given text"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-3 mt-4 justify-end">
                <Button onClick={() => form.reset()} variant="outline">
                  Clear
                </Button>
                <Button type="submit" disabled={!isValid || isSubmitting || isTyping}>
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Summarize"}
                </Button>
              </div>
            </CardContent>
          </form>
        </Form>
      </Card>

      <Card className="w-full flex-3/5 shadow-none m-4 bg-neutral-900">
        <CardContent className="h-full flex flex-col gap-10">
          <h2 className="text-lg font-bold">Summary</h2>

          {isSubmitting ? (
            <div className="flex flex-col justify-center items-center gap-2 min-h-96">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              <p className="text-muted-foreground text-sm">Generating summary...</p>
            </div>
          ) : summary.length > 0 ? (
            <div className="whitespace-pre-line">{displayedSummary}</div>
          ) : (
            <div className="flex flex-col justify-center items-center gap-2 min-h-96">
              <Upload className="w-10 h-10 text-muted-foreground" />
              <p className="text-muted-foreground text-sm">Your summary will appear here</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TextTab;
