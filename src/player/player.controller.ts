import {
  Controller,
  Get,
  Post,
  Body,
  Render,
  Redirect,
  UseGuards,
} from '@nestjs/common';
import { PlayerService } from './player.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('player')
@UseGuards(AuthGuard)
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
    return { players: await this.playerService.findAll() };
  }
}
