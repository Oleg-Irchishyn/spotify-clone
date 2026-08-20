import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { ValidationPipe } from './pipes/validation.pipe';

async function start(): Promise<void> {
  try {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
      origin: process.env.CLIENT_URL,
      credentials: true,
    });

    const config = new DocumentBuilder()
      .setTitle('Music Platform Application')
      .setDescription('REST API documentation')
      .setVersion('1.2.0')
      .addTag('Music Platform microservice')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Enter fresh JWT access token',
          in: 'header',
        },
        'bearerAuth', // Назва схеми безпеки, її запам'ятовуємо
      )
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/docs', app, document);

    app.useGlobalPipes(new ValidationPipe());

    await app.listen(process.env.PORT ?? 5000, () => {
      console.log(`Server started on port ${process.env.PORT ?? 5000}`);
    });
  } catch (error) {
    console.error('Error starting the application:', error);
  }
}

void start();
