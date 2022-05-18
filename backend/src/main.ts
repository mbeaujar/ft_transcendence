import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  app.setGlobalPrefix('api');

  app.use(cookieParser(process.env.COOKIE_SECRET));

  app.enableCors({
    origin: true,
    credentials: true,
  });

  /** Create a documentation of the backend (http://localhost:3000/api) */
  SwaggerModule.setup(
    'api',
    app,
    SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle('ft_transcendence')
        .setDescription('REST API Documentation')
        .setVersion('1.0')
        .build(),
    ),
  );
  await app.listen(3000);
}
bootstrap();
