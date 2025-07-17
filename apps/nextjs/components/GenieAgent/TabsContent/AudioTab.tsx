"use client";

import { useAuth } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@workspace/ui/components/form";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select";
import { Slider } from "@workspace/ui/components/slider";
import { AxiosError } from "axios";
import { Loader2, Upload } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import DropzoneComponent from "@/components/Reusable/Dropzone";
import { GenieTextTypes, genieSummarySchema } from "@/lib/schema";
import { GenieTypes } from "@/lib/types";
import { summaryService } from "@/services/summary/summary-service";

const AudioTab = ({ workspace, type }: { workspace: string; type: GenieTypes }) => {
  const { getToken } = useAuth();

  const [summary, setSummary] = useState<string>("");
  const [displayedSummary, setDisplayedSummary] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const form = useForm<GenieTextTypes>({
    resolver: zodResolver(genieSummarySchema),
    defaultValues: {
      summaryLength: 25,
      inputText: "",
      summaryTone: "Simple",
      summaryType: "audio",
      workspaceId: workspace,
    },
  });

  const {
    formState: { isValid, isSubmitting },
  } = form;

  const onSubmit = async (data: GenieTextTypes) => {
    try {
      const token = await getToken();

      const formData = new FormData();
      formData.append("inputFile", data.inputFile as unknown as File);
      formData.append("summaryType", data.summaryType);
      formData.append("summaryTone", data.summaryTone);
      formData.append("summaryLength", data.summaryLength.toString());
      formData.append("workspaceId", data.workspaceId);

      const { data: summaryData } = await summaryService.createSummary({
        data: formData,
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
    <div className="flex gap-4 bg-muted rounded-md p-4">
      <Card className="bg-muted w-full flex-3/5 shadow-none border-none">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader className="hidden">
              <CardTitle className="text-white flex items-center justify-between">Text</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 shadow-none">
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
                name="inputFile"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <DropzoneComponent
                        type="audio"
                        value={field.value as unknown as File}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-3 mt-4 justify-end">
                <Button type="button" onClick={() => form.reset()} variant="outline">
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

      <Card className="w-full flex-3/5 shadow-none m-4">
        <CardContent className="h-full flex flex-col gap-10">
          <ScrollArea className="h-[600px]">
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
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default AudioTab;
