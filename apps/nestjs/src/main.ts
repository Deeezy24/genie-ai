import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

    app.enableCors({
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        exposedHeaders: ["Content-Length"],
        maxAge: 600,
        credentials: true,
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
    await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
