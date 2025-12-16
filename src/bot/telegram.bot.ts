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
      await this.bot.sendMessage(chatId, 'Assalomu alaykum! Xush kelibsiz! Iltimos, ismingizni yuboring:');
      
      // Foydalanuvchi holatini saqlash uchun
      this.bot.once('message', async (msg) => {
        const name = msg.text;
        await this.bot.sendMessage(chatId, `Rahmat, ${name}! Endi elektron pochtangizni yuboring:`);
        
        this.bot.once('message', async (msg) => {
          const email = msg.text;
          
          // MongoDB'ga saqlash
          const ticket = new this.ticketModel({
            studentId: new Date().getTime().toString(), // Yoki boshqa unique ID
            studentName: name,
            studentEmail: email,
            title: 'Telegram orqali murojaat',
            description: `Foydalanuvchi Telegram orqali murojaat qildi. Chat ID: ${chatId}`,
            status: 'open',
            chatId: chatId.toString()
          });
          
          await ticket.save();
          
          await this.bot.sendMessage(chatId, 'Murojaatingiz qabul qilindi! Tez orada siz bilan bog\'lanamiz.');
        });
      });
    });

    // Boshqa xabarlar uchun handler
    this.bot.on('message', async (msg) => {
      if (msg.text && !msg.text.startsWith('/')) {
        const chatId = msg.chat.id;
        
        // Agar foydalanuvchi oldin ro'yxatdan o'tgan bo'lsa, yangi ticket yaratamiz
        const existingTicket = await this.ticketModel.findOne({ chatId: chatId.toString() }).sort({ createdAt: -1 });
        
        if (existingTicket) {
          const newTicket = new this.ticketModel({
            studentId: existingTicket.studentId,
            studentName: existingTicket.studentName,
            studentEmail: existingTicket.studentEmail,
            title: 'Yangi murojaat',
            description: msg.text,
            status: 'open',
            chatId: chatId.toString()
          });
          
          await newTicket.save();
          await this.bot.sendMessage(chatId, 'Yangi murojaatingiz qabul qilindi!');
        } else {
          await this.bot.sendMessage(chatId, 'Iltimos, avval /start komandasini yuboring!');
        }
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