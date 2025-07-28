"use client";

import { useAuth } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@workspace/ui/components/form";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select";
import { Slider } from "@workspace/ui/components/slider";
import { Textarea } from "@workspace/ui/components/textarea";
import { Loader2, Upload } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { removeSpecialCharacters } from "@/lib/helper";
import { ParagraphGeneratorTypes, paragraphGeneratorSchema } from "@/lib/schema";

const ParagraphGenerator = ({ workspace, type }: { workspace: string; type: string }) => {
  const { getToken } = useAuth();

  const [summary, setSummary] = useState<string>("");
  const [displayedSummary, setDisplayedSummary] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [chatId, setChatId] = useState<string>("");

  const form = useForm<ParagraphGeneratorTypes>({
    resolver: zodResolver(paragraphGeneratorSchema),
    defaultValues: {
      summaryLength: 25,
      inputText: "",
      summaryTone: "Simple",
      workspaceId: workspace,
      chatId: chatId,
      modelId: "4f6bdbbe-8b98-48cb-a340-3f7bd7b6d11e",
    },
  });

  const {
    formState: { isValid, isSubmitting },
  } = form;

  const onSubmit = async (data: ParagraphGeneratorTypes) => {
    try {
      const token = await getToken();
      const summaryData = "";

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
    } catch (error: unknown) {
      toast.error((error as Error).message || "An error occurred");
    }
  };

  const formattedText = removeSpecialCharacters(type);

  return (
    <div className="flex gap-4 rounded-md p-4">
      <Card className="w-3/5 border-none shadow-none">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader className="hidden">
              <CardTitle className="text-white flex items-center justify-between">Text</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">{formattedText}</h2>
                <div className="flex items-center gap-4">
                  <FormField
                    control={form.control}
                    name="summaryTone"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger className="rounded-full px-4 py-1">
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
                      <div className="flex items-center gap-2 rounded-full border px-3 py-1">
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

              <FormField
                control={form.control}
                name="inputText"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        className="min-h-96 resize-none"
                        placeholder="Describe what is the best way to summarize the given text"
                        {...field}
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

      <Card className="w-2/5 border-none shadow-none">
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

export default ParagraphGenerator;
