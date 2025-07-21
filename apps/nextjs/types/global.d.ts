export {};

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      onboardingComplete?: boolean;
      currentWorkspace?: string;
      memberId?: string;
      subscription: {
        subscription_id: string;
        subscription_plan: string;
        subscription_status: string;
        subscription_date_created: string;
        subscription_date_updated: string;
        subscription_date_trial_ends: number;
      };
    };
  }
  interface Window {
    google: any;
    createLemonSqueezy?: () => void;
    LemonSqueezy?: {
      Url: {
        Open: (url: string) => void;
      };
    };
  }
}
