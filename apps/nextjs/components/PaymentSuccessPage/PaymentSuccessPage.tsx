// app/payment/success/page.tsx (if using Next.js App Router)

import { CheckCircle } from "lucide-react"; // optional icon
import Link from "next/link";

const PaymentSuccessPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-green-50">
      <CheckCircle className="text-green-600 w-16 h-16 mb-4" />
      <h1 className="text-3xl font-bold text-green-700">Payment Successful!</h1>
      <p className="text-lg text-gray-700 mt-2">Thank you for your purchase. Your transaction has been completed.</p>
      <Link href="/" className="mt-6 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition">
        Go to Homepage
      </Link>
    </div>
  );
};

export default PaymentSuccessPage;
