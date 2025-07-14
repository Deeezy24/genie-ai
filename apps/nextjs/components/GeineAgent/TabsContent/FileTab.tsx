"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@workspace/ui/components/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select";
import { Slider } from "@workspace/ui/components/slider";
import { Textarea } from "@workspace/ui/components/textarea";
import { Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { GenieTextTypes, genieTextSchema } from "@/lib/schema";

const FileTab = ({ workspace, type }: { workspace: string; type: string }) => {
  const form = useForm<GenieTextTypes>({
    resolver: zodResolver(genieTextSchema),
    defaultValues: {
      summaryMode: "Simple",
      summaryLength: 50,
      inputText: "",
      workspaceId: workspace,
    },
  });

  const onSubmit = (data: GenieTextTypes) => {
    try {
      console.log(data);
    } catch (error) {}
  };

  return (
    <div className="flex gap-4 bg-muted rounded-md">
      <Card className="bg-muted w-full flex-3/5 shadow-none">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          Text
          <div className="flex items-center gap-4">
            <Select value={summaryMode} onValueChange={setSummaryMode}>
              <SelectTrigger className="w-32 bg-gray-700 border-gray-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="Simple">Simple</SelectItem>
                <SelectItem value="Detailed">Detailed</SelectItem>
                <SelectItem value="Bullet Points">Bullet Points</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2 min-w-48">
              <span className="text-sm text-gray-400">Shorter</span>
              <Slider
                value={summaryLength}
                onValueChange={setSummaryLength}
                max={100}
                min={10}
                step={10}
                className="flex-1"
              />
              <span className="text-sm text-gray-400">Longer</span>
            </div>
          </div>
        </CardTitle>
      </CardHeader> */}
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">{type}</h2>
                <div className="flex items-center gap-4">
                  <FormField
                    control={form.control}
                    name="summaryMode"
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
                    <FormLabel>Summary Mode</FormLabel>
                    <FormControl>
                      <Textarea
                        className="min-h-96 border-2 border-muted-foreground"
                        placeholder="Enter your text here..."
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
                <Button type="submit" disabled={!form.formState.isValid}>
                  Summarize
                </Button>
              </div>
            </CardContent>
          </form>
        </Form>
      </Card>

      <Card className=" w-full flex-3/5 shadow-none m-4 bg-neutral-900">
        <CardContent className="h-full flex flex-col gap-10">
          <h2 className="text-lg font-bold">Summary</h2>
          <div className="flex flex-col justify-center items-center gap-2 min-h-96">
            <Upload className="w-10 h-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Drag and drop your file here or click to upload</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FileTab;
