import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Res,
  Render,
  ParseIntPipe,
  Logger,
} from '@nestjs/common';
import { GameService } from '../services';
import { CreateGameDto } from '../dto/create-game.dto';
import { Response } from 'express';
import { PlayerService } from '../../player/player.service';
import { QrCodePix } from 'qrcode-pix';

@Controller('game')
export class GameController {
  private readonly logger = new Logger(GameController.name);
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

      if (cashOut.chips <= 0) {
        this.logger.debug(
          `Pulando geração do QrCodePix pois as fichas do jogador ${cashOut.player.name} são 0`,
        );
        continue;
      }

      const value = (cashOut.chips * game.dolar) / 10_000;
      const royalFlushPercent = game.royalFlushFee / 100;
      const netValue = value * (1 - royalFlushPercent);
      this.logger.debug(
        `Valor CashOut ${cashOut.id} para o player ${cashOut.player.name} no valor: R$ ${netValue.toFixed(2)}`,
      );
      const qrCodePix = QrCodePix({
        version: '01',
        key: player.pix,
        name: player.name,
        city: 'GOIANIA',
        message: `Cash Out #${cashOut.id}`,
        cep: '74223230',
        value: netValue,
      });
      cashOut['paymentPixCode'] = qrCodePix.payload();
      cashOut['paymentPixQRCode'] = qrCodePix.base64();
      cashOut['netValue'] = netValue;
    }

    return {
      game,
      gamePlayers,
      allPlayers: (await this.playerService.findAll()).sort((a, b) =>
        a.name > b.name ? 1 : a.name == b.name ? 0 : -1,
      ),
    };
  }
}
