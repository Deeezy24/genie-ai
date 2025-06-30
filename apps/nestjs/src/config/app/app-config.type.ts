import { Environment } from "../../constants/app.constant";

export type AppConfig = {
  nodeEnv: `${Environment}`;
  isHttps: boolean;
  name: string;
  url: string;
  port: number;
  debug: boolean;
  fallbackLanguage: string;
  appLogging: boolean;
  logLevel: string;
  logService: string;
  corsOrigin: boolean | string[] | "*";
};
