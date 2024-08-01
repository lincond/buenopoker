import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Res,
  Render,
  ParseIntPipe,
} from '@nestjs/common';
import { GameService } from '../services';
import { CreateGameDto } from '../dto/create-game.dto';
import { Response } from 'express';
import { PlayerService } from '../../player/player.service';

@Controller('game')
export class GameController {
  constructor(
    private readonly gameService: GameService,
    private readonly playerService: PlayerService,
  ) {}

  @Post()
  async create(
    @Body() createGameDto: CreateGameDto,
    @Res() response: Response,
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
    const game = await this.gameService.findOne(id);
    const gamePlayers = game.buyIns
      .map((buyIn) => ({ ...buyIn.player, chips: buyIn.chips }))
      .reduce((acc, cur) => {
        const player = acc.find((p) => p.id === cur.id);
        if (player) {
          player.chips += cur.chips;
        } else {
          acc.push(cur);
        }
        return acc;
      }, []);

    for (const cashOut of game.cashOuts) {
      const player = gamePlayers.find((p) => p.id === cashOut.player.id);
      if (player) {
        player.chips -= cashOut.chips;
      }
    }

    return {
      game,
      gamePlayers,
      allPlayers: await this.playerService.findAll(),
    };
  }
}
