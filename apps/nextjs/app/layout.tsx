import { Providers } from "@/components/providers";
import "@workspace/ui/globals.css";
import { Inter } from "next/font/google";
import Script from "next/script";
import { generatePageMetadata } from "./metadata";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export async function generateMetadata() {
  return generatePageMetadata({
    title: "CoverGenie | AI Cover Generator",
    description: "CoverGenie | AI Cover Generator",
  });
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="dns-prefetch" href="https://challenges.cloudflare.com" />
        <link rel="preconnect" href="https://challenges.cloudflare.com" crossOrigin="anonymous" />
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          strategy="beforeInteractive"
          crossOrigin="anonymous"
        />
      </head>

      <body className={`${fontSans.variable} font-sans antialiased `}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
