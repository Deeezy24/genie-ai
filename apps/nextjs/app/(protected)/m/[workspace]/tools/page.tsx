import { auth } from "@clerk/nextjs/server";
import { Card, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Separator } from "@workspace/ui/components/separator";
import Link from "next/link";
import { toolsService } from "@/services/tools/tools-service";

const handleFetchTools = async () => {
  try {
    const { getToken } = await auth();
    const token = await getToken();
    const { data } = await toolsService.getTools({
      isPopular: true,
      token: token,
      revalidate: 60,
    });

    return data;
  } catch (error) {}
};

const page = async () => {
  const tools = await handleFetchTools();
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-2">Tools to get you started</h1>

      <Separator className="my-6" />

      <h2 className="text-xl font-bold mb-4">Tools</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {tools?.map((tool) => (
          <Link key={tool.agent_tool_id} href={tool.agent_tool_url}>
            <Card className="transition-colors hover:bg-muted cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{tool.agent_tool_icon}</div>
                  <CardTitle>{tool.agent_tool_name}</CardTitle>
                </div>
                <CardDescription className="pt-2">{tool.agent_tool_description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default page;
