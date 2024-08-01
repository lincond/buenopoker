import { Controller, Get, Post, Body, Param, Res, Render, ParseIntPipe } from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';
import { Response } from 'express';
import { PlayerService } from 'src/player/player.service';

@Controller('game')
export class GameController {
  constructor(
    private readonly gameService: GameService,
    private readonly playerService: PlayerService
  ) {}

  @Post()
  async create(
    @Body() createGameDto: CreateGameDto,
    @Res() response: Response
  ) {
    const game = await this.gameService.create(createGameDto);
    response.redirect(`/game/${game.id}`);
  }

  @Get()
  @Render('game/index')
  async findAll() {
    return { games: await this.gameService.findAll() };
  }

  @Get(':id')
  @Render('game/show')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return { 
      game: await this.gameService.findOne(id),
      players: await this.playerService.findAll()
    };
  }

}
