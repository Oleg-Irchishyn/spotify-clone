import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const port = Number(process.env.TCP_PORT ?? 4001);

  // No HTTP listener at all — this service only speaks NestJS's TCP
  // microservice protocol. It cannot be reached with curl/a browser; only a
  // ClientProxy (the api-gateway) can talk to it.
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: process.env.TCP_HOST ?? '0.0.0.0',
        port,
      },
    },
  );

  await app.listen();
  console.log(`[auth-service] listening for TCP messages on :${port}`);
}

void bootstrap();
