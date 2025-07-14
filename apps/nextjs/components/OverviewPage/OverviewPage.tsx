"use client";

import { Card, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Separator } from "@workspace/ui/components/separator";
import { useParams, useRouter } from "next/navigation";

const tools = (workspace: string) => [
  {
    title: "Genie AI",
    description: "Get the gist of any content with one click!",
    icon: "🎯",
    url: `/m/${workspace}/tools/genie`,
  },
  {
    title: "Paragraph Writer",
    description:
      "Generate well-crafted paragraphs effortlessly with a click. Your go-to tool for seamless content creation!",
    icon: "✍️",
    url: `/m/${workspace}/tools/paragraph-writer`,
  },
  {
    title: "Paraphraser",
    description: "Let the magic begin! Generate well-crafted paragraphs effortlessly with a click. Your go-to tool...",
    icon: "🔁",
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
            className="bg-[#1b1b1c] hover:bg-[#222] transition-colors border-none border-2"
            onClick={() => handleToolClick(tool.url)}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="text-2xl">{tool.icon}</div>
                <CardTitle>{tool.title}</CardTitle>
              </div>
              <CardDescription className="text-gray-400">{tool.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OverviewPage;
