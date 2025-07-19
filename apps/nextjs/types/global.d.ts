export {};

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      onboardingComplete?: boolean;
      currentWorkspace?: string;
      memberId?: string;
      subscription?: {
        subscription_id: string;
        subscription_plan: string;
        subscription_status: string;
        subscription_date_created: string;
        subscription_date_updated: string;
        subscription_user_id: string;
      };
    };
  }
  interface Window {
    google: any;
  }
}
