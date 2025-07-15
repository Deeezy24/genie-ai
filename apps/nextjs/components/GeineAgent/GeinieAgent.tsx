import { Separator } from "@workspace/ui/components/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { FileText, FileType, Headphones, Image, Link, Youtube } from "lucide-react";
import TextTab from "./TabsContent/TextTab";

const GeinieAgent = ({ workspace }: { workspace: string }) => {
  const tabs = [
    {
      value: "text",
      label: "Text",
      icon: <FileText size={16} />,
      content: <TextTab workspace={workspace} type="text" />,
    },
    {
      value: "url",
      label: "URL",
      icon: <Link size={16} />,
      content: <div>Enter a URL to summarize</div>,
    },
    {
      value: "pdf",
      label: "PDF",
      icon: <FileType size={16} />,
      content: <div>Upload a PDF document</div>,
    },
    {
      value: "audio",
      label: "Audio",
      icon: <Headphones size={16} />,
      content: <div>Upload or record audio</div>,
    },
    {
      value: "youtube",
      label: "YouTube",
      icon: <Youtube size={16} />,
      content: <div>Paste a YouTube video link</div>,
    },
    {
      value: "image",
      label: "Image",
      icon: <Image size={16} />,
      content: <div>Upload an image to analyze</div>,
    },
  ];

  return (
    <div className="min-h-screen p-8 space-y-8">
      <h1 className="text-3xl font-bold mb-2">Genie AI</h1>

      <Separator className="my-6" />

      <Tabs defaultValue="text" className="w-full">
        <TabsList className="grid w-full grid-cols-6 mb-4">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="flex items-center gap-2">
              {tab.icon}
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default GeinieAgent;
