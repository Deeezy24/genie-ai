"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useMemo } from "react";

export type BreadcrumbItem = {
  title: string;
  link: string;
};

/**
 * Friendly titles for individual path segments.
 * Keys are raw segment values, values are what you want to display.
 * Leave out what you don't need – they'll fall back to Title Case.
 */
const SEGMENT_TITLE_MAP: Record<string, string> = {
  dashboard: "Dashboard",
  employee: "Employee",
  product: "Product",
  settings: "Settings",
  // ...
};

/** Extra breadcrumb injected when the path ends with `/edit` or a `?mode=edit` query. */
function getTrailingEditCrumb(pathname: string, search: URLSearchParams): BreadcrumbItem | null {
  if (pathname.endsWith("/edit") || search.get("mode") === "edit") {
    return { title: "Edit", link: pathname };
  }
  return null;
}

export function useBreadcrumbs(): BreadcrumbItem[] {
  const pathname = usePathname(); // e.g. "/dashboard/employee/123/edit"
  const searchParams = useSearchParams(); // e.g. "?mode=edit"

  return useMemo(() => {
    /** Strip query/hash and split into segments */
    const segments = pathname
      .replace(/^\/|\/$/g, "") // trim leading/trailing slash
      .split("/")
      .filter(Boolean); // ["dashboard","employee","123","edit"]

    const crumbs: BreadcrumbItem[] = [];

    segments.forEach((segment, idx) => {
      // Build link up to this segment
      const link = "/" + segments.slice(0, idx + 1).join("/");

      // Turn [id]-like params into ":id", keep others
      const isDynamic = segment.startsWith("[") && segment.endsWith("]");
      const cleaned = isDynamic ? `:${segment.slice(1, -1)}` : segment;

      const title =
        SEGMENT_TITLE_MAP[cleaned] ??
        cleaned
          .replace(/[-_]/g, " ") // kebab / snake → spaces
          .replace(/\b\w/g, (l) => l.toUpperCase()); // Title Case

      crumbs.push({ title, link });
    });

    /** Optionally append a trailing breadcrumb (e.g. "Edit") */
    const extra = getTrailingEditCrumb(pathname, searchParams);
    if (extra) crumbs.push(extra);

    return crumbs;
  }, [pathname, searchParams]);
}
