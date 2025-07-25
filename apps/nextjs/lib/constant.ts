export const IS_PUBLIC_ROUTE = ["/sign-in(.*)", "/sign-up(.*)", "/", "/callback(.*)", "/sign-in/sso-callback(.*)"];
export const IS_ONBOARDING_ROUTE = ["/onboarding(.*)"];
export const IS_PROTECTED_ROUTE = ["/dashboard(.*)"];

export const IS_ALLOWED_AUTHENTICATED_ROUTE = {
  FREE: [
    "/m/:workspace/overview",
    "/m/:workspace/account/:rest*",
    "/m/:workspace/tools/:rest*",
    "/checkout",
    "/payment",
    "/pricing",
  ],
  BASIC: ["/m/:workspace/:rest*", "checkout", "/pricing", "/c/:rest*"],
  PRO: ["/m/:workspace/:rest*", "checkout", "/pricing", "/c/:rest*"],
};

//style for dark and non dark
export const NAV_BG = "bg-white dark:bg-zinc-800"; // common helpers
export const TXT_PRIMARY = "text-gray-900 dark:text-white";
export const TXT_SECONDARY = "text-gray-600 dark:text-gray-400";
export const SEP = "bg-gray-200 dark:bg-zinc-700";
export const INPUT_BG = "bg-gray-50 dark:bg-zinc-700 dark:border-zinc-600 focus:ring-teal-500";

export const AGENT_TYPES = ["genie"];
