import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import * as session from 'express-session';
import * as passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /** Create a documentation of the backend (http://localhost:3000/api) */
  SwaggerModule.setup(
    'api',
    app,
    SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle('ft_transcendence')
        .setDescription('ft_transcendence REST API Documentation')
        .setVersion('1.0')
        .build(),
    ),
  );

  app.use(
    session({
      secret: process.env.SECRET_SESSION,
      resave: false,
      saveUninitialized: false,
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(3000);
}
bootstrap();
