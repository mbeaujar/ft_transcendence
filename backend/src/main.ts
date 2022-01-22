import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /** Create a documentation of the backend (http://localhost:3000/api) */
  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('ft_transcendence')
      .setDescription('ft_transcendence REST API Documentation')
      .setVersion('1.0')
      .build(),
  );

  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
