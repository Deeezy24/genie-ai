import { generatePageMetadata } from "@/app/metadata";
import AccountPage from "@/components/AccountPage/AccountPage";

export const generateMetadata = () => {
  return generatePageMetadata({
    title: "Account | CoverGenie",
    description: "Account | CoverGenie",
  });
};

const page = () => {
  return <AccountPage />;
};

export default page;
