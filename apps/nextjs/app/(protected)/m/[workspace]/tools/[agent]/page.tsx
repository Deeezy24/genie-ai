import { redirect } from "next/navigation";
import GenieAgent from "@/components/GenieAgent/Genie";
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
      default:
        return null;
    }
  };

  return <AgentToRender />;
};

export default page;
