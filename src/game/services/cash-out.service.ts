import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CashOut } from '../entities/cash-out.entity';
import { Repository } from 'typeorm';
import { CreateCashOutDto } from '../dto/create-cash-out.dto';
import { Game } from '../entities/game.entity';
import { PlayerService } from 'src/player/player.service';

@Injectable()
export class CashOutService {
  constructor(
    @InjectRepository(CashOut)
    private readonly cashOutRepository: Repository<CashOut>,
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
    private readonly playerService: PlayerService,
  ) {}

  async create(gameId: number, createCashOutDto: CreateCashOutDto) {
    const game = await this.gameRepository.findOne({
      where: { id: gameId },
      relations: {
        buyIns: {
          player: true,
        },
        cashOuts: {
          player: true,
        },
      },
    });

    if (!game) {
      throw new Error('Jogo não encontrado');
    }

    const player = await this.playerService.findOne(createCashOutDto.playerId);
    if (!player) {
      throw new Error('Jogador inválido');
    }

    const playersBuyIns = game.buyIns.filter(
      (buyIn) => buyIn.player.id === createCashOutDto.playerId,
    );
    if (!playersBuyIns.length) {
      throw new Error('O jogador não está no jogo');
    }

    const buyInChips = game.buyIns.reduce((acc, cur) => acc + cur.chips, 0);

    if (createCashOutDto.chips > buyInChips) {
      throw new Error('O valor de fichas é maior do que o disponível no jogo');
    }

    const cashOutChips = game.cashOuts.reduce((acc, cur) => acc + cur.chips, 0);

    const gameChips = buyInChips - cashOutChips;
    console.assert(gameChips >= 0);

    if (createCashOutDto.chips > gameChips) {
      throw new Error('O valor de fichas é maior do que o disponível no jogo');
    }

    const cashOut = new CashOut({
      player,
      game,
      chips: createCashOutDto.chips,
    });
    return await this.cashOutRepository.save(cashOut);
  }
}
