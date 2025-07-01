import { z } from "zod";
import { DatabaseConfig } from "./database-type";

const envSchema = z.object({
  DATABASE_URL: z.string(),
  DIRECT_URL: z.string(),
});

type EnvVars = z.infer<typeof envSchema>;

export function getConfigDatabase(env: EnvVars): DatabaseConfig {
  return {
    databaseUrl: env.DATABASE_URL,
    directUrl: env.DIRECT_URL,
  };
}
