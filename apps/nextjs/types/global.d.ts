export {};

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      onboardingComplete?: boolean;
      currentWorkspace?: string;
      memberId?: string;
    };
  }
  interface Window {
    google: any;
  }
}
