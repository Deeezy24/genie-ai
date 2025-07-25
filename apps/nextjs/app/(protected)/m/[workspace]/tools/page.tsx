import { Separator } from "@workspace/ui/components/separator";

const page = () => {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-2">Tools to get you started</h1>

      <Separator className="my-6" />

      <h2 className="text-xl font-bold mb-4">Tools</h2>
      {/* <div className="grid md:grid-cols-3 gap-4">
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
      </div> */}
    </div>
  );
};

export default page;
