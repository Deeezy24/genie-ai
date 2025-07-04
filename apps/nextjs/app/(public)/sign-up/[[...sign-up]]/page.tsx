import { generatePageMetadata } from "@/app/metadata";
import SignUpPage from "@/components/SignUpPage/SignUpPage";

export const generateMetadata = () => {
  return generatePageMetadata({
    title: "Sign Up | CoverGenie",
    description: "Sign Up | CoverGenie",
  });
};

const page = () => {
  return <SignUpPage />;
};

export default page;
