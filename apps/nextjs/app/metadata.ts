// app/metadata.ts
import { Metadata } from "next";

const BASE_URL = "http://localhost:3000";
const SITE_NAME = "Geeni ai";
const DEFAULT_DESCRIPTION = "Geeni ai";

export const defaultMetadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  metadataBase: new URL(BASE_URL),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    siteName: SITE_NAME,
    url: BASE_URL,
    type: "website",
    images: [
      {
        url: "/og-image.png", // Relative to metadataBase
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    images: ["/og-image.png"],
  },
};

interface PageMetadataProps extends Metadata {
  path?: string;
}

export function generatePageMetadata({ path, ...metadata }: PageMetadataProps = {}): Metadata {
  const url = path ? `${BASE_URL}${path}` : BASE_URL;

  return {
    ...defaultMetadata,
    ...metadata,
    ...(path && {
      alternates: {
        canonical: path,
      },
    }),
    openGraph: {
      ...defaultMetadata.openGraph,
      ...metadata.openGraph,
      url,
    },
    twitter: {
      ...defaultMetadata.twitter,
      ...metadata.twitter,
    },
  };
}
