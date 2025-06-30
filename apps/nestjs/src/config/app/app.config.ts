import process from "node:process";
import { registerAs } from "@nestjs/config";
import { z } from "zod";
import { Environment, LogService } from "../../constants/app.constant";
import { AppConfig } from "./app-config.type";

/**
 * ############################################################
 * Zod-based environment validation for the **AppConfig** module
 * ############################################################
 *
 * - No more `class-validator` decorators
 * - Works seamlessly with `@nestjs/config` via `registerAs`
 * - Converts string env vars ➜ strongly-typed booleans & numbers
 */

const envSchema = z.object({
  NODE_ENV: z.nativeEnum(Environment).optional(),

  /** App identity & URLs */
  APP_NAME: z.string().min(1, "APP_NAME cannot be empty"),
  APP_URL: z.string().url().optional(),

  /** Ports */
  APP_PORT: z
    .string()
    .transform((v) => parseInt(v, 10))
    .pipe(z.number().int().min(0).max(65_535)),
  PORT: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : undefined))
    .pipe(z.number().int().min(0).max(65_535).optional()),

  /** Debug & localisation */
  APP_DEBUG: z
    .string()
    .optional()
    .transform((v) => v === "true"),
  APP_FALLBACK_LANGUAGE: z.string().optional(),

  /** Logging */
  APP_LOGGING: z
    .string()
    .optional()
    .transform((v) => v === "true"),
  APP_LOG_LEVEL: z.string().optional(),
  APP_LOG_SERVICE: z.nativeEnum(LogService).optional(),

  /** CORS */
  APP_CORS_ORIGIN: z
    .string()
    .regex(/^(true|false|\*|([\w]+:\/\/)?([\w.-]+)(:[0-9]+)?)?(,([\w]+:\/\/)?([\w.-]+)(:[0-9]+)?)*$/)
    .optional(),
});

type EnvVars = z.infer<typeof envSchema>;

/**
 * Build the runtime CORS origin value (boolean | '*' | string[])
 */
function buildCorsOrigin(env: EnvVars): AppConfig["corsOrigin"] {
  const { APP_CORS_ORIGIN: corsOrigin } = env;
  if (corsOrigin === "true") return true;
  if (corsOrigin === "*") return "*";
  if (!corsOrigin || corsOrigin === "false") return false;

  const origins = corsOrigin.split(",").map((origin) => origin.trim());

  /** Add localhost ➜ 127.0.0.1 mirror */
  const localhostMirrors = origins
    .map((origin) =>
      origin.startsWith("http://localhost") ? origin.replace("http://localhost", "http://127.0.0.1") : origin,
    )
    .filter((origin, idx) => origin !== origins[idx]);
  origins.push(...localhostMirrors);

  /** Add non-www ➜ www mirror */
  const wwwMirrors = origins
    .map((origin) => (origin.startsWith("https://") ? origin.replace("https://", "https://www.") : origin))
    .filter((origin, idx) => origin !== origins[idx]);
  origins.push(...wwwMirrors);

  return origins;
}

/**
 * Translate validated **EnvVars** → strongly-typed **AppConfig**
 */
export function getConfig(env: EnvVars): AppConfig {
  const port = env.APP_PORT;

  return {
    nodeEnv: (env.NODE_ENV || Environment.Development) as Environment,

    name: env.APP_NAME,
    url: env.APP_URL || `http://localhost:${port}`,
    isHttps: env.APP_URL?.startsWith("https://") ?? false,
    port,

    /* Quality-of-life flags */
    debug: env.APP_DEBUG ?? false,
    fallbackLanguage: env.APP_FALLBACK_LANGUAGE || "en",

    /* Logging */
    appLogging: env.APP_LOGGING ?? false,
    logLevel: env.APP_LOG_LEVEL || "warn",
    logService: env.APP_LOG_SERVICE || LogService.Console,

    /* Security */
    corsOrigin: buildCorsOrigin(env),
  };
}

/**
 * Export for **ConfigModule.registerAs** — parses & validates once
 */
export default registerAs<AppConfig>("app", () => {
  // eslint-disable-next-line no-console
  console.info("Registering AppConfig from environment variables");

  // 1. Validate & coerce env variables
  const env = envSchema.parse(process.env);

  // 2. Map them into our runtime config type
  return getConfig(env);
});
