export {};

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      onboardingComplete?: boolean;
      currentWorkspace?: string;
    };
  }
  interface Window {
    google: any;
  }
}
