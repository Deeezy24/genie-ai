import { AppConfig } from "./app/app-config.type";
import { DatabaseConfig } from "./database/database-type";

export type GlobalConfig = {
  app: AppConfig;
  database: DatabaseConfig;
};
