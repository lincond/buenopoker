import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BuyIn } from '../entities/buy-in.entity';
import { Repository } from 'typeorm';
import { CreateBuyInDto } from '../dto/create-buy-in.dto';
import { Game } from '../entities/game.entity';
import { PlayerService } from '../../player/player.service';

@Injectable()
export class BuyInService {
  constructor(
    @InjectRepository(BuyIn)
    private readonly buyInRepository: Repository<BuyIn>,
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
    private readonly playerService: PlayerService,
  ) {}

  async create(gameId: number, createBuyInDto: CreateBuyInDto) {
    const game = await this.gameRepository.findOne({ where: { id: gameId } });
    if (!game) {
      throw new Error('Jogo não encontrado');
    }

    const player = await this.playerService.findOne(createBuyInDto.playerId);
    if (!player) {
      throw new Error('Jogador inválido');
    }

    const buyIn = new BuyIn({ player, game, chips: createBuyInDto.chips });
    return await this.buyInRepository.save(buyIn);
  }
}
