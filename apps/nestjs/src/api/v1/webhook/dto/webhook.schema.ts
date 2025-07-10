// src/webhooks/user-created.schema.ts
import { z } from "zod";

const EmailAddress = z.object({
  id: z.string(),
  email_address: z.string().email(),
  linked_to: z.array(z.any()),
  object: z.literal("email_address"),
  verification: z.object({
    status: z.enum(["verified", "unverified", "pending"]),
    strategy: z.string(),
  }),
});

const HttpRequest = z.object({
  client_ip: z.string().ip().or(z.literal("0.0.0.0")),
  user_agent: z.string(),
});

export const userCreatedWebhookSchema = z.object({
  object: z.literal("event"),
  type: z.literal("user.created").or(z.literal("user.deleted")),
  timestamp: z.number(),
  data: z.object({
    id: z.string(),
    object: z.literal("user"),
    external_id: z.string().nullable(),
    first_name: z.string().nullable(),
    last_name: z.string().nullable(),
    username: z.string().nullable(),
    image_url: z.string().url(),
    profile_image_url: z.string().url(),
    birthday: z.string().nullable(),
    gender: z.string().nullable(),
    email_addresses: z.array(EmailAddress),
    phone_numbers: z.array(z.any()),
    web3_wallets: z.array(z.any()),
    external_accounts: z.array(z.any()),
    password_enabled: z.boolean(),
    two_factor_enabled: z.boolean(),
    created_at: z.number(),
    updated_at: z.number(),
    last_sign_in_at: z.number().nullable(),
    primary_email_address_id: z.string(),
    primary_phone_number_id: z.string().nullable(),
    primary_web3_wallet_id: z.string().nullable(),
    private_metadata: z.record(z.any()),
    public_metadata: z.record(z.any()),
    unsafe_metadata: z.record(z.any()),
  }),
  event_attributes: z.object({
    http_request: HttpRequest,
  }),
});

export type UserCreatedWebhook = z.infer<typeof userCreatedWebhookSchema>;
