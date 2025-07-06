import { Suspense } from "react";
import SsoCallBackPage from "@/components/SsoCallbackPage/SsoCallBackPage";

const page = () => {
  return (
    <Suspense fallback={null}>
      <SsoCallBackPage />
    </Suspense>
  );
};

export default page;
