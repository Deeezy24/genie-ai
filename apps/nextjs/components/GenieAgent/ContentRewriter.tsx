"use client";

import { useAuth } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@workspace/ui/components/form";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select";
import { Separator } from "@workspace/ui/components/separator";
import { Slider } from "@workspace/ui/components/slider";
import { Textarea } from "@workspace/ui/components/textarea";
import { Check, Copy, FileText, Loader2, RefreshCw, Wand2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { removeSpecialCharacters } from "@/lib/helper";
import { ParagraphGeneratorTypes, paragraphGeneratorSchema } from "@/lib/schema";
import { summaryService } from "@/services/summary/summary-service";

const ContentRewriter = ({ workspace, type }: { workspace: string; type: string }) => {
  const { getToken } = useAuth();

  const [paraphrasedText, setParaphrasedText] = useState<string>("");
  const [displayedText, setDisplayedText] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [chatId, setChatId] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [wordCount, setWordCount] = useState<number>(0);
  const [originalWordCount, setOriginalWordCount] = useState<number>(0);

  const form = useForm<ParagraphGeneratorTypes>({
    resolver: zodResolver(paragraphGeneratorSchema),
    defaultValues: {
      summaryLength: 50,
      inputText: "",
      summaryTone: "Standard",
      workspaceId: workspace,
      chatId: chatId,
      modelId: "4f6bdbbe-8b98-48cb-a340-3f7bd7b6d11e",
    },
  });

  const {
    formState: { isValid, isSubmitting },
    watch,
  } = form;

  const inputText = watch("inputText");

  useEffect(() => {
    const words = inputText
      ?.trim()
      ?.split(/\s+/)
      ?.filter((word) => word.length > 0);
    setOriginalWordCount(words?.length || 0);
  }, [inputText]);

  useEffect(() => {
    const words = paraphrasedText
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);
    setWordCount(words.length);
  }, [paraphrasedText]);

  const onSubmit = async (data: ParagraphGeneratorTypes) => {
    try {
      const token = await getToken();

      const response =
        type === "content-rewriter"
          ? await summaryService.createContentRewriter({ data, token })
          : await summaryService.createParagraph({ data, token });

      const content = response?.data ?? "";

      setChatId(response?.chatId ?? "");
      setParaphrasedText(content);
      setDisplayedText("");
      setIsTyping(true);

      let i = 0;
      const interval = setInterval(() => {
        setDisplayedText((prev) => prev + content?.charAt(i));
        i++;
        if (i >= content?.length) {
          clearInterval(interval);
          setIsTyping(false);
        }
      }, 20);
    } catch (error: unknown) {
      toast.error((error as Error).message || "An error occurred");
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(paraphrasedText);
      setCopied(true);
      toast.success("Paraphrased text copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy text");
    }
  };

  const handleRegenerate = () => {
    if (form.getValues("inputText")?.trim()) {
      onSubmit(form.getValues());
    }
  };

  const getSimilarityLabel = (value: number) => {
    if (type === "content-rewriter") {
      if (value <= 25) return "Very Different";
      if (value <= 50) return "Moderate Change";
      if (value <= 75) return "Similar Structure";
      return "Minimal Change";
    } else {
      if (value <= 25) return "Short";
      if (value <= 50) return "Medium";
      if (value <= 75) return "Long";
      return "Very Long";
    }
  };

  const getToneDescription = (tone: string) => {
    const descriptions = {
      Academic: "Formal, scholarly language",
      Professional: "Business-appropriate tone",
      Casual: "Conversational, relaxed style",
      Creative: "Expressive, varied language",
      Standard: "Balanced, neutral tone",
    };
    return descriptions[tone as keyof typeof descriptions] || "";
  };

  const formattedType = removeSpecialCharacters(type);

  return (
    <div className="flex flex-col md:flex-row gap-6 rounded-md p-4">
      <Card className="w-full md:w-3/5 border-none shadow-sm bg-zinc-900/60">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wand2 className="w-5 h-5 text-primary" />
                  <CardTitle className="text-xl">{formattedType}</CardTitle>
                </div>
                {originalWordCount > 0 && (
                  <Badge variant="secondary" className="text-sm">
                    {originalWordCount} words
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border-2">
                <div className="flex items-center gap-6">
                  <FormField
                    control={form.control}
                    name="summaryTone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Writing Style</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger className="w-40 rounded-md">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Academic">Academic</SelectItem>
                              <SelectItem value="Professional">Professional</SelectItem>
                              <SelectItem value="Standard">Standard</SelectItem>
                              <SelectItem value="Casual">Casual</SelectItem>
                              <SelectItem value="Creative">Creative</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <p className="text-xs text-muted-foreground mt-1">{getToneDescription(field.value)}</p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator orientation="vertical" className="h-16" />

                  <FormField
                    control={form.control}
                    name="summaryLength"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          {type === "content-rewriter" ? "Similarity Level" : "Paraphrase Level"}
                        </FormLabel>
                        <div className="flex items-center gap-3 pt-2">
                          <span className="text-xs text-muted-foreground w-16">
                            {type === "content-rewriter" ? "Different" : "Short"}
                          </span>
                          <Slider
                            value={[field.value]}
                            onValueChange={(val) => field.onChange(val[0])}
                            min={25}
                            max={100}
                            step={25}
                            className="w-32"
                          />
                          <span className="text-xs text-muted-foreground w-16">
                            {type === "content-rewriter" ? "Similar" : "Long"}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{getSimilarityLabel(field.value)}</p>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Input Section */}
              <FormField
                control={form.control}
                name="inputText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Original Text
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        className="min-h-80 resize-none border-2 focus:border-primary transition-colors"
                        placeholder={`Paste or type the text you want to ${type === "paragraph-writer" ? "paragraph" : "paraphrase"} here. The tool will ${type === "paragraph-writer" ? "complete" : "paraphrase"} it while preserving the original meaning.`}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end">
                <Button
                  type="button"
                  onClick={() => {
                    form.reset();
                    setParaphrasedText("");
                    setDisplayedText("");
                  }}
                  variant="outline"
                  className="px-6"
                >
                  Clear All
                </Button>
                <Button
                  type="submit"
                  disabled={!isValid || isSubmitting || isTyping || !inputText?.trim()}
                  className="px-8"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      {type === "content-rewriter" ? "Rewriting..." : "Paraphrasing..."}
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 mr-2" />
                      {formattedType}
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </form>
        </Form>
      </Card>

      {/* Results Panel */}
      <Card className="w-full md:w-2/5 border-none shadow-sm bg-zinc-900/60">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              {formattedType} Text
            </CardTitle>
            {paraphrasedText && (
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {wordCount} words
                </Badge>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRegenerate}
                    disabled={isSubmitting || isTyping || !inputText?.trim()}
                    className="h-8 w-8 p-0"
                  >
                    <RefreshCw className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopy}
                    disabled={!paraphrasedText}
                    className="h-8 w-8 p-0"
                  >
                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="h-full">
          <ScrollArea className="h-[500px]">
            {isSubmitting ? (
              <div className="flex flex-col justify-center items-center gap-3 min-h-96">
                <div className="relative">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">Rewriting your text...</p>
                  <p className="text-xs text-muted-foreground mt-1">This may take a few moments</p>
                </div>
              </div>
            ) : paraphrasedText.length > 0 ? (
              <div className="space-y-4">
                <div className="p-4 bg-muted/20 rounded-lg border-l-4 border-primary">
                  <div className="whitespace-pre-line text-sm leading-relaxed">
                    {displayedText}
                    {isTyping && <span className="animate-pulse">|</span>}
                  </div>
                </div>
                {!isTyping && type === "content-rewriter" && (
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
                    <span>Paraphrasing complete</span>
                    <span>{((wordCount / originalWordCount) * 100).toFixed(0)}% of original length</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center gap-4 min-h-96 text-center">
                <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center">
                  <Wand2 className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ready to paraphrase</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter your text and click "Paraphrase Text" to get started
                  </p>
                </div>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentRewriter;
