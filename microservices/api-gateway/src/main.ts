import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { ValidationPipe } from './common/validation.pipe';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.enableCors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe());

  // Only the gateway gets Swagger: it's the one piece with an actual public
  // REST surface. auth-service/catalog-service speak the TCP microservice
  // protocol only (see the README) - there's no HTTP surface on them for
  // Swagger to describe.
  const config = new DocumentBuilder()
    .setTitle('Music Platform API Gateway')
    .setDescription(
      'The public REST surface for the microservices sandbox. Every route ' +
        "here forwards to auth-service or catalog-service over TCP - this " +
        'gateway is the only one of the three with an HTTP API to document.',
    )
    .setVersion('1.0.0')
    .addTag('Authorization')
    .addTag('Users')
    .addTag('Tracks')
    .addTag('Albums')
    .addTag('Stats')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description:
          'Also accepted as an httpOnly "token" cookie, set automatically by /auth/login and /auth/registration.',
        in: 'header',
      },
      'bearerAuth',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs', app, document);

  const port = Number(process.env.PORT ?? 4000);
  await app.listen(port);
  console.log(`[api-gateway] listening on :${port}`);
  console.log(`[api-gateway] Swagger docs at http://localhost:${port}/docs`);
}

void bootstrap();
