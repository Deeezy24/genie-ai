import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { IS_ALLOWED_AUTHENTICATED_ROUTE, IS_ONBOARDING_ROUTE, IS_PUBLIC_ROUTE } from "./lib/constant";

const isOnboardingRoute = createRouteMatcher(IS_ONBOARDING_ROUTE);
const isPublicRoute = createRouteMatcher(IS_PUBLIC_ROUTE);

const createAllowedRouteMatcher = (plan: string) => {
  const routes =
    IS_ALLOWED_AUTHENTICATED_ROUTE[plan.toUpperCase() as keyof typeof IS_ALLOWED_AUTHENTICATED_ROUTE] || [];
  return createRouteMatcher(routes);
};

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { userId, sessionClaims, redirectToSignIn } = await auth();

  const currentPlan = sessionClaims?.metadata?.subscription?.subscription_plan || "FREE";
  const isAllowedAuthenticatedRoute = createAllowedRouteMatcher(currentPlan);

  if (userId && isOnboardingRoute(req)) {
    return NextResponse.next();
  }

  if (!userId && !isPublicRoute(req)) {
    return redirectToSignIn({ returnBackUrl: req.url });
  }

  if (sessionClaims && isPublicRoute(req)) {
    return NextResponse.redirect(new URL(`/m/${sessionClaims.metadata.currentWorkspace}/overview`, req.url));
  }

  if (userId && !sessionClaims?.metadata?.onboardingComplete) {
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }

  if (userId && !isPublicRoute(req) && !isAllowedAuthenticatedRoute(req)) {
    return NextResponse.redirect(new URL(`/m/${sessionClaims.metadata.currentWorkspace}/overview`, req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
