import { redirect } from "next/navigation";
import ContentRewriter from "@/components/GenieAgent/ContentRewriter";
import GenieAgent from "@/components/GenieAgent/Genie";
import HumanizerAgent from "@/components/GenieAgent/HumanizerAgent";
import { AGENT_TYPES } from "@/lib/constant";

const page = async ({ params }: { params: Promise<{ workspace: string; agent: string }> }) => {
  const { workspace, agent } = await params;

  if (!AGENT_TYPES.includes(agent)) {
    redirect("/m/" + workspace + "/overview");
  }

  const AgentToRender = () => {
    switch (agent) {
      case "genie":
        return <GenieAgent workspace={workspace} />;
      case "paragraph-writer":
        return <ContentRewriter workspace={workspace} type="paragraph-writer" />;
      case "paraphraser":
        return <ContentRewriter workspace={workspace} type="content-rewriter" />;
      case "humanizer":
        return <HumanizerAgent workspace={workspace} />;
      default:
        return null;
    }
  };

  return <AgentToRender />;
};

export default page;
