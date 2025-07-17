import multipart from "@fastify/multipart";
import { ValidationPipe, VersioningType } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { EnvVars, getConfig } from "./config/app/app.config";
import { Environment } from "./constants/app.constant";
import { consoleLoggingConfig } from "./tools/logger/logger-factory";

async function bootstrap() {
  const envToLogger: Record<`${Environment}`, any> = {
    local: consoleLoggingConfig(),
    development: consoleLoggingConfig(),
    production: true,
    staging: true,
    test: false,
  } as const;

  const appConfig = getConfig(process.env as unknown as EnvVars);

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: envToLogger[appConfig.nodeEnv],
      bodyLimit: 12 * 1024 * 1024,
    }),
  );

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.register(multipart); // 👈 this enables multipart/form-data support

  app.enableCors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  });

  app.enableVersioning({
    type: VersioningType.URI,
  });

  const config = new DocumentBuilder()
    .setTitle("NestJS API")
    .setDescription("The NestJS API description")
    .setVersion("1.0")
    .addTag("NestJS")
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup("api/docs", app, documentFactory);

  app.setGlobalPrefix("api/v1");
  await app.listen(appConfig.port ?? 8080, "0.0.0.0");
}
bootstrap();
