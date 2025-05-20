import { NestFactory } from '@nestjs/core';
import { EventModule } from './event.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(EventModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen(process.env.EVENT_SERVER_PORT ?? 3000);
}
bootstrap();
