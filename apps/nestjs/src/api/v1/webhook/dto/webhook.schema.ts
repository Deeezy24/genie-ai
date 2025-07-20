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
  type: z.union([z.literal("user.created"), z.literal("user.deleted")]),
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

export const subscriptionCreatedWebhookSchema = z.object({
  meta: z.object({
    event_name: z.union([
      z.literal("subscription_created"),
      z.literal("subscription_updated"),
      z.literal("subscription_cancelled"),
      z.literal("subscription_expired"),
      z.literal("subscription_payment_failed"),
      z.literal("subscription_payment_success"),
      z.literal("subscription_payment_recovered"),
      z.literal("subscription_payment_refunded"),
      z.literal("subscription_plan_changed"),
    ]),
  }),
  type: z.literal("subscriptions"),
  id: z.string(),
  attributes: z.object({
    custom: z.object({
      user_id: z.string(),
      plan_id: z.string(),
    }),
    store_id: z.number(),
    customer_id: z.number(),
    order_id: z.number(),
    order_item_id: z.number(),
    product_id: z.number(),
    variant_id: z.number(),
    product_name: z.string(),
    variant_name: z.string(),
    user_name: z.string(),
    user_email: z.string(),
    status: z.string(),
    status_formatted: z.string(),
    card_brand: z.string(),
    card_last_four: z.string(),
    payment_processor: z.string(),
    pause: z.null(),
    cancelled: z.boolean(),
    trial_ends_at: z.null(),
    billing_anchor: z.number(),
    first_subscription_item: z.object({
      id: z.number(),
      subscription_id: z.number(),
      price_id: z.number(),
      quantity: z.number(),
      created_at: z.string(),
      updated_at: z.string(),
    }),
    urls: z.object({
      update_payment_method: z.string(),
      customer_portal: z.string(),
      customer_portal_update_subscription: z.string(),
    }),
    renews_at: z.string(),
    ends_at: z.null(),
    created_at: z.string(),
    updated_at: z.string(),
    test_mode: z.boolean(),
  }),
});

export type SubscriptionCreatedWebhook = z.infer<typeof subscriptionCreatedWebhookSchema>;
export type UserCreatedWebhook = z.infer<typeof userCreatedWebhookSchema>;
