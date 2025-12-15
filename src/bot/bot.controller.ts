import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { BotService } from './bot.service';
import { CreateBotDto } from './dto/create-bot.dto';
import { UpdateBotDto } from './dto/update-bot.dto';

@Controller('bot')
export class BotController {
  constructor(private readonly botService: BotService) {}

  @Post('ticket')
  async createTicket(@Body() createBotDto: CreateBotDto) {
    return await this.botService.create(createBotDto);
  }

  @Get('tickets')
  async findAllTickets(@Query('status') status?: string) {
    return await this.botService.findAll(status);
  }

  @Get('ticket/:id')
  async findOneTicket(@Param('id') id: string) {
    return await this.botService.findOne(id);
  }

  @Patch('ticket/:id')
  async updateTicket(@Param('id') id: string, @Body() updateBotDto: UpdateBotDto) {
    return await this.botService.update(id, updateBotDto);
  }

  @Delete('ticket/:id')
  async removeTicket(@Param('id') id: string) {
    return await this.botService.remove(id);
  }

  @Post('ticket/:id/respond')
  async respondToTicket(
    @Param('id') id: string,
    @Body() body: { response: string; teacherId: string },
  ) {
    return await this.botService.respondToTicket(id, body.response, body.teacherId);
  }
}
