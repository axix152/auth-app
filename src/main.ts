// src/main.ts
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strips properties that do not have decorators
      forbidNonWhitelisted: true, // Throws an error if non-whitelisted properties are present
      transform: true, // Automatically transforms payloads to be objects typed according to DTO classes
    }),
  );

  await app.listen(3000);
}
bootstrap();
