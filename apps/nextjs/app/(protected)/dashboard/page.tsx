import { generatePageMetadata } from "@/app/metadata";

export async function generateMetadata() {
  return generatePageMetadata({
    title: "Dashboard | CoverGenie",
    description: "Dashboard | CoverGenie",
  });
}

const DashboardPage = () => {
  return <div>DashboardPage</div>;
};

export default DashboardPage;
