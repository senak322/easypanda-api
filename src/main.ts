import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true, // Включает CORS с настройками по умолчанию
  });

  // Устанавливаем глобальный префикс маршрутов
  app.setGlobalPrefix('api');

  await app.listen(3001);
}
bootstrap();
