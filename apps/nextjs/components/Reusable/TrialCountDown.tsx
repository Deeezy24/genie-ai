import { useQueryClient } from "@tanstack/react-query";
import { Alert, AlertDescription } from "@workspace/ui/components/alert";
import { Button } from "@workspace/ui/components/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@workspace/ui/components/tooltip";
import { AlertTriangle, Clock, Crown, Info } from "lucide-react";
import { User } from "@/lib/types";

const TrialCountdown = ({ isActive = false }) => {
  const queryClient = useQueryClient();
  const user = queryClient.getQueryData<User>(["user-info"]);
  const daysLeft = user?.subscription?.subscription_date_ends ?? 0;

  if (!user) return null;

  const urgencyLevel = daysLeft <= 3 ? "critical" : daysLeft <= 7 ? "warning" : "normal";

  const isFreeTrialEndingSoon = user.subscription.subscription_plan === "FREE" && daysLeft <= 5;

  if (isFreeTrialEndingSoon && !isActive) {
    return (
      <div
        className={`
        transform transition-all duration-700 ease-out
        ${!isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
      `}
      >
        <Alert
          className={`
          relative overflow-hidden border-0 shadow-lg backdrop-blur-sm
          transition-all duration-300 hover:shadow-xl
          ${
            urgencyLevel === "critical"
              ? "bg-gradient-to-r from-red-950/90 to-red-900/90 text-red-100"
              : urgencyLevel === "warning"
                ? "bg-gradient-to-r from-amber-950/90 to-amber-900/90 text-amber-100"
                : "bg-gradient-to-r from-slate-900/95 to-slate-800/95 text-slate-100"
          }
        `}
        >
          <div
            className={`
            absolute inset-0 opacity-20 animate-pulse
            ${
              urgencyLevel === "critical"
                ? "bg-gradient-to-r from-red-500 via-transparent to-red-500"
                : urgencyLevel === "warning"
                  ? "bg-gradient-to-r from-amber-500 via-transparent to-amber-500"
                  : "bg-gradient-to-r from-blue-500 via-transparent to-purple-500"
            }
          `}
          />

          <div
            className={`
            absolute inset-0 rounded-lg 
            ${
              urgencyLevel === "critical"
                ? "shadow-[inset_0_0_1px_rgba(239,68,68,0.5)]"
                : urgencyLevel === "warning"
                  ? "shadow-[inset_0_0_1px_rgba(245,158,11,0.5)]"
                  : "shadow-[inset_0_0_1px_rgba(148,163,184,0.3)]"
            }
          `}
          />

          <AlertDescription className="relative z-10">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className={`
                  p-2 rounded-full transition-all duration-300
                  ${
                    urgencyLevel === "critical"
                      ? "bg-red-800/50 animate-pulse"
                      : urgencyLevel === "warning"
                        ? "bg-amber-800/50"
                        : "bg-slate-700/50"
                  }
                `}
                >
                  {urgencyLevel === "critical" ? <AlertTriangle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Free</span>
                    <div
                      className={`
                      px-2 py-0.5 rounded-full text-xs font-mono
                      ${
                        urgencyLevel === "critical"
                          ? "bg-red-800/30 text-red-200"
                          : urgencyLevel === "warning"
                            ? "bg-amber-800/30 text-amber-200"
                            : "bg-slate-700/30 text-slate-300"
                      }
                    `}
                    >
                      {Math.ceil(daysLeft)} days left
                    </div>
                  </div>

                  <div className="text-xs opacity-80">
                    {urgencyLevel === "critical"
                      ? "Trial expires soon - upgrade to continue"
                      : urgencyLevel === "warning"
                        ? "Consider upgrading to unlock full features"
                        : "Enjoying your trial? Upgrade anytime"}
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`
              mt-3 h-1.5 rounded-full overflow-hidden
              ${
                urgencyLevel === "critical"
                  ? "bg-red-950/50"
                  : urgencyLevel === "warning"
                    ? "bg-amber-950/50"
                    : "bg-slate-800/50"
              }
            `}
            >
              <div
                className={`
                  h-full transition-all duration-1000 ease-out rounded-full
                  ${
                    urgencyLevel === "critical"
                      ? "bg-gradient-to-r from-red-400 to-red-600 animate-pulse"
                      : urgencyLevel === "warning"
                        ? "bg-gradient-to-r from-amber-400 to-amber-600"
                        : "bg-gradient-to-r from-blue-400 to-purple-600"
                  }
                `}
                style={{
                  width: `${Math.max(5, (daysLeft / 14) * 100)}%`,
                  boxShadow:
                    urgencyLevel === "critical"
                      ? "0 0 8px rgba(239,68,68,0.6)"
                      : urgencyLevel === "warning"
                        ? "0 0 8px rgba(245,158,11,0.6)"
                        : "0 0 8px rgba(59,130,246,0.6)",
                }}
              />
            </div>

            <Button
              className={`
                group flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium
                transition-all duration-300 hover:scale-105 active:scale-95 w-full
                ${
                  urgencyLevel === "critical"
                    ? "bg-red-600 hover:bg-red-500 text-white shadow-lg hover:shadow-red-500/25"
                    : urgencyLevel === "warning"
                      ? "bg-amber-600 hover:bg-amber-500 text-white shadow-lg hover:shadow-amber-500/25"
                      : "bg-white hover:bg-slate-100 text-slate-900 shadow-lg hover:shadow-white/25"
                }
              `}
            >
              <Crown className="h-3 w-3 transition-transform group-hover:rotate-12" />
              {user.subscription.subscription_plan === "FREE" ? "Upgrade Now" : "Pay Now"}
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    isFreeTrialEndingSoon && (
      <Tooltip>
        <TooltipTrigger className="p-1">
          <Info className="h-6 w-6" />
        </TooltipTrigger>
        <TooltipContent className="bg-background text-foreground">
          <p>Free trial ends in {daysLeft} days</p>
        </TooltipContent>
      </Tooltip>
    )
  );
};

export default TrialCountdown;
