"use client";

import { useAuth } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { TimePicker } from "@workspace/ui/components/date-time-picker";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select";
import { Slider } from "@workspace/ui/components/slider";
import { Textarea } from "@workspace/ui/components/textarea";
import { AxiosError } from "axios";
import { Loader2, Upload } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import DropzoneComponent from "@/components/Reusable/Dropzone";
import { GenieTextTypes, genieSummarySchema } from "@/lib/schema";
import { GenieTypes } from "@/lib/types";
import { summaryService } from "@/services/summary/summary-service";

const GenieTabs = ({ workspace, type }: { workspace: string; type: GenieTypes }) => {
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
      summaryType: type,
      workspaceId: workspace,
      inputTime: "Specific Time",
    },
  });

  const {
    formState: { isValid, isSubmitting },
  } = form;

  const onSubmit = async (data: GenieTextTypes) => {
    try {
      const token = await getToken();
      let summaryData = "";

      switch (type) {
        case "text": {
          const { data: result } = await summaryService.createSummary({
            data,
            token,
          });
          summaryData = result;
          break;
        }
        case "url": {
          const { data: result } = await summaryService.createSummary({
            data,
            token,
          });
          summaryData = result;
          break;
        }
        case "video": {
          const { data: result } = await summaryService.createSummary({
            data,
            token,
          });
          summaryData = result;
          break;
        }
        default: {
          const formData = new FormData();
          formData.append("inputFile", data.inputFile as unknown as File);
          formData.append("summaryType", data.summaryType);
          formData.append("summaryTone", data.summaryTone);
          formData.append("summaryLength", data.summaryLength.toString());
          formData.append("workspaceId", data.workspaceId);

          const { data: result } = await summaryService.createSummaryFile({
            data: formData,
            token,
          });
          summaryData = result;
          break;
        }
      }

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
      } else {
        toast.error("Something went wrong.");
      }
    }
  };

  const isInputTime = form.watch("inputTime");
  return (
    <div className="flex gap-4 rounded-md p-4">
      <Card className="w-3/5 border border-border shadow-none bg-card">
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
                            <SelectTrigger className="rounded-full px-4 py-1 border border-input bg-background">
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
                      <div className="flex items-center gap-2 rounded-full border border-input bg-background px-3 py-1">
                        <span className="text-sm font-medium text-muted-foreground">Shorter</span>
                        <Slider
                          value={[field.value]}
                          onValueChange={(val) => field.onChange(val[0])}
                          min={25}
                          max={75}
                          step={25}
                          className="w-40"
                        />
                        <span className="text-sm font-medium text-muted-foreground">Longer</span>
                      </div>
                    )}
                  />
                </div>
              </div>
              {type === "video" && (
                <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                  <FormField
                    control={form.control}
                    name="inputTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger className="rounded-full px-4 py-1 border border-input bg-background">
                              <SelectValue placeholder="Select a summary mode" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Specific Time">Specific Time</SelectItem>
                              <SelectItem value="Full Video">Full Video</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {isInputTime === "Specific Time" && (
                    <div className="flex flex-col sm:flex-row gap-2 w-full">
                      <FormField
                        control={form.control}
                        name="startTimestamp"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Time</FormLabel>
                            <FormControl>
                              <div className="min-w-[120px] flex-1">
                                <TimePicker
                                  date={field.value ? new Date(field.value) : null}
                                  onChange={field.onChange}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="endTimestamp"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>End Time</FormLabel>
                            <FormControl>
                              <div className="min-w-[120px] flex-1">
                                <TimePicker
                                  date={field.value ? new Date(field.value) : null}
                                  onChange={field.onChange}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>
              )}

              {type === "text" ? (
                <FormField
                  control={form.control}
                  name="inputText"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          className="min-h-96 resize-none border border-input bg-background"
                          placeholder="Describe what is the best way to summarize the given text"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : type === "url" ? (
                <FormField
                  control={form.control}
                  name="inputUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          className="border border-input bg-background"
                          placeholder="Enter a URL to summarize"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : type === "file" ? (
                <FormField
                  control={form.control}
                  name="inputFile"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <DropzoneComponent
                          value={field.value as unknown as File}
                          onChange={field.onChange}
                          className="border-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : type === "audio" ? (
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
                          className="border-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : type === "video" ? (
                <FormField
                  control={form.control}
                  name="inputUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>YouTube Video URL</FormLabel>
                      <FormControl>
                        <Input
                          className="border border-input bg-background"
                          placeholder="https://www.youtube.com/watch?v=example"
                          {...field}
                        />
                      </FormControl>
                      <p className="text-xs text-muted-foreground mt-1">Paste a YouTube video URL to summarize.</p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : type === "image" ? (
                <FormField
                  control={form.control}
                  name="inputFile"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <DropzoneComponent
                          type="image"
                          value={field.value as unknown as File}
                          onChange={field.onChange}
                          className="border-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : null}

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

      <Card className="w-2/5 border border-border shadow-none bg-card">
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent className="h-full">
          <ScrollArea className="h-[450px]">
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

export default GenieTabs;
