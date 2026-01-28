import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import {
  SwaggerModule,
  DocumentBuilder,
  type OpenAPIObject,
} from "@nestjs/swagger";

import cookieParser from "cookie-parser";

import { AppModule } from "./app.module";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle("Blog App Phase 3")
    .setDescription("Blog app API documentation")
    .setVersion("1.0")
    .addTag("Blogs")
    .build();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const documentFactory = (): OpenAPIObject =>
    SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("/api", app, documentFactory);
  await app.listen(process.env.PORT ?? 3000);
}

// NOSONAR
void (async () => {
  try {
    await bootstrap();
  } catch (error) {
    const logger = new Logger("Bootstrap");
    logger.error("Application failed to start", error);
    process.exit(1);
  }
})();
