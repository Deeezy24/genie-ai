"use client";

import { Card, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Separator } from "@workspace/ui/components/separator";
import { useRouter } from "next/navigation";
import { Tools } from "@/lib/types";

type Props = {
  tools: Tools[];
};

const OverviewPage = ({ tools }: Props) => {
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
        {tools.map((tool) => (
          <Card
            key={tool.agent_tool_id}
            className="transition-colors hover:bg-muted cursor-pointer"
            onClick={() => handleToolClick(tool.agent_tool_url)}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="text-2xl">{tool.agent_tool_icon}</div>
                <CardTitle>{tool.agent_tool_name}</CardTitle>
              </div>
              <CardDescription className="pt-2">{tool.agent_tool_description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OverviewPage;
