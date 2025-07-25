import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import PaymentSuccessPage from "@/components/PaymentSuccessPage/PaymentSuccessPage";
import { checkOutService } from "@/services/check-out/check-out";

const handleFetchLatestPaidCheckout = async () => {
  const { getToken, sessionClaims } = await auth();
  const token = await getToken();
  const { data } = await checkOutService.getLatestPaidCheckout({ token: token ?? "" });

  if (data.subscription_payment_status === "PAID") {
    return redirect(`/m/${sessionClaims?.metadata.currentWorkspace}/overview`);
  }

  return data;
};

const page = async () => {
  await handleFetchLatestPaidCheckout();
  return <PaymentSuccessPage />;
};

export default page;
