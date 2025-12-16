import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { BotService } from './bot.service';
import { BotController } from './bot.controller';
import { TicketSchema } from './entities/bot.entity';
import { TelegramBotService } from './telegram.bot';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Ticket', schema: TicketSchema }]),
    ConfigModule
  ],
  controllers: [BotController],
  providers: [BotService, TelegramBotService],
  exports: [TelegramBotService],
})
export class BotModule {}
