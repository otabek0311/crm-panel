import { Injectable, OnModuleInit } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ticket } from './entities/bot.entity';

@Injectable()
export class TelegramBotService implements OnModuleInit {
  private bot: TelegramBot;

  constructor(
    private configService: ConfigService,
    @InjectModel('Ticket') private ticketModel: Model<Ticket>
  ) {}

  onModuleInit() {
    this.initializeBot();
  }

  private initializeBot() {
    const token = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    
    if (!token) {
      console.error('TELEGRAM_BOT_TOKEN topilmadi! Iltimos, .env faylida TELEGRAM_BOT_TOKEN ni ko\'rsating');
      return;
    }

    this.bot = new TelegramBot.default(token, { polling: true });
    this.setupBot();
  }

  private async setupBot() {
    // /start komandasi uchun handler
    this.bot.onText(/\/start/, async (msg) => {
      const chatId = msg.chat.id;
      const name = msg.from?.first_name ? `${msg.from.first_name}${msg.from.last_name ? ' ' + msg.from.last_name : ''}` : 'Foydalanuvchi';
      const username = msg.from?.username || '';
      await this.bot.sendMessage(chatId, `${name}, muammo yoki savolingizni yozib yuboring:`);

      // Foydalanuvchi birinchi muammoni yuborganda darhol ticket ochiladi
      this.bot.once('message', async (msg) => {
        const description = msg.text;
        const ticket = new this.ticketModel({
          studentId: chatId.toString(),
          studentName: name,
          studentEmail: username ? username + '@telegram' : '',
          title: 'Telegram orqali murojaat',
          description,
          status: 'open',
          chatId: chatId.toString()
        });
        await ticket.save();
        await this.bot.sendMessage(chatId, 'Murojaatingiz qabul qilindi! Tez orada siz bilan bog\'lanamiz.');
      });
    });

    // Boshqa xabarlar uchun handler
    this.bot.on('message', async (msg) => {
      if (msg.text && !msg.text.startsWith('/')) {
        const chatId = msg.chat.id;
        // Faqat birinchi marta /start bosilganda ticket ochiladi, boshqa paytlarda faqat yangi ticket ochiladi
        const name = msg.from?.first_name ? `${msg.from.first_name}${msg.from.last_name ? ' ' + msg.from.last_name : ''}` : 'Foydalanuvchi';
        const username = msg.from?.username || '';
        const newTicket = new this.ticketModel({
          studentId: chatId.toString(),
          studentName: name,
          studentEmail: username ? username + '@telegram' : '',
          title: 'Yangi murojaat',
          description: msg.text,
          status: 'open',
          chatId: chatId.toString()
        });
        await newTicket.save();
        await this.bot.sendMessage(chatId, 'Murojaatingiz qabul qilindi!');
      }
    });
  }

  async sendMessage(chatId: number | string, text: string): Promise<void> {
    if (!this.bot) {
      console.error('Bot ishga tushmagan!');
      return;
    }
    await this.bot.sendMessage(chatId, text);
  }
}