import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TelegramBotService } from './bot/telegram.bot';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Telegram botni ishga tushiramiz
  try {
    const bot = app.get(TelegramBotService);
    console.log('Telegram bot ishga tushirildi');
  } catch (error) {
    console.error('Telegram botni ishga tushirishda xatolik:', error.message);
  }

  const port = process.env.PORT ?? 3000;
  await app.listen(port, () => {
    console.log(`Server ishladi: http://localhost:${port}`);
  });
}

bootstrap();
