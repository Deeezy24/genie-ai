// src/types/global.d.ts

import { FastifyRequest } from "fastify";

declare global {
  export type FastifyRequestWithUser = FastifyRequest & { user: User };

  namespace Storage {
    type MultipartFile = {
      buffer: Buffer;
      filename: string;
      size: number;
      mimetype: string;
      fieldname: string;
    };
  }

  interface publicMetadata {
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
  }
}

declare module "fastify" {
  interface FastifyRequest {
    storedFiles?: Record<string, Storage.MultipartFile[]>;
    body?: Record<string, any>;
  }
}
