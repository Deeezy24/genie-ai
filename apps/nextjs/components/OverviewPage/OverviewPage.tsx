"use client";

import { Card, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Separator } from "@workspace/ui/components/separator";
import { useParams, useRouter } from "next/navigation";

const tools = (workspace: string) => [
  {
    title: "AI Summarizer",
    description: "Instantly get the key points from any text. Your fast-track to understanding.",
    icon: "✨",
    url: `/m/${workspace}/tools/genie`,
  },
  {
    title: "Paragraph Generator",
    description: "Create perfectly structured paragraphs on any topic. Boost your writing productivity.",
    icon: "🚀",
    url: `/m/${workspace}/tools/paragraph-writer`,
  },
  {
    title: "Content Rewriter",
    description: "Rephrase and refresh your content to make it unique and engaging.",
    icon: "🔄",
    url: `/m/${workspace}/tools/paraphraser`,
  },
];

const OverviewPage = () => {
  const { workspace } = useParams() as { workspace: string };
  const router = useRouter();

  const handleToolClick = (url: string) => {
    router.push(url);
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-2">Get started</h1>

      <Separator className="my-6" />

      <h2 className="text-xl font-bold mb-4">Popular Tools</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {tools(workspace).map((tool) => (
          <Card
            key={tool.title}
            className="transition-colors hover:bg-muted cursor-pointer"
            onClick={() => handleToolClick(tool.url)}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="text-2xl">{tool.icon}</div>
                <CardTitle>{tool.title}</CardTitle>
              </div>
              <CardDescription className="pt-2">{tool.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OverviewPage;
