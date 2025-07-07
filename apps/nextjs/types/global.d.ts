export {};

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      onboardingComplete?: boolean;
      workspace_id?: string;
    };
  }
  interface Window {
    google: any;
  }
}
