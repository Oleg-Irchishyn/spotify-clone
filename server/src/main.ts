import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from './pipes/validation.pipe';

async function start(): Promise<void> {
  try {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
      origin: process.env.CLIENT_URL,
      credentials: true,
    });

    const config = new DocumentBuilder()
      .setTitle('Spotify Clone Application')
      .setDescription('REST API documentation')
      .setVersion('1.0.0')
      .addTag('Spotify Clone microservice')
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
