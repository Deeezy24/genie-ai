import { auth } from "@clerk/nextjs/server";
import OverviewPage from "@/components/OverviewPage/OverviewPage";
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
  const data = await handleFetchTools();

  return <OverviewPage tools={data ?? []} />;
};

export default page;
