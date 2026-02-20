import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: true, // Allow all origins (reflects request origin, works with credentials)
      credentials: true,
    },
  });

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3001, '0.0.0.0');
  console.log(`Application is running on: http://0.0.0.0:${process.env.PORT ?? 3001}`);
  console.log(`Local access:   http://localhost:${process.env.PORT ?? 3001}`);
}
bootstrap();
