import { Controller, Get, Post, Body, Render, Redirect } from '@nestjs/common';
import { PlayerService } from './player.service';
import { CreatePlayerDto } from './dto/create-player.dto';

@Controller('player')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Post()
  @Redirect('/player')
  async create(@Body() createPlayerDto: CreatePlayerDto) {
    await this.playerService.create(createPlayerDto);
  }

  @Get()
  @Render('player/index')
  async findAll() {
    return { players: this.playerService.findAll() };
  }
}
