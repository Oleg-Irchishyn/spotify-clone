import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const httpPort = Number(process.env.HTTP_PORT ?? 4002);
  const tcpPort = Number(process.env.TCP_PORT ?? 4012);

  // A "hybrid" Nest app: a regular HTTP listener (only used to serve the
  // uploaded static files — see ServeStaticModule in AppModule) plus a
  // connected TCP microservice for the actual tracks/albums RPC surface.
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: process.env.TCP_HOST ?? '0.0.0.0',
      port: tcpPort,
    },
  });

  await app.startAllMicroservices();
  await app.listen(httpPort);
  console.log(
    `[catalog-service] static files on :${httpPort}, TCP messages on :${tcpPort}`,
  );
}

void bootstrap();
