import { Injectable } from '@nestjs/common';
import { CreateGameDto } from '../dto/create-game.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from '../entities/game.entity';
import { Repository } from 'typeorm';
import { BetweenDatesAdapter } from '../../common/adapters/between.adapter';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
  ) { }

  async create(createGameDto: CreateGameDto) {
    const game = new Game(createGameDto);
    return await this.gameRepository.save(game);
  }

  async findAll() {
    return await this.gameRepository.find({
      relations: {
        buyIns: {
          player: true,
        },
        cashOuts: {
          player: true,
        },
      },
      order: {
        createdAt: -1,
      },
    });
  }

  async findOne(id: number) {
    return await this.gameRepository.findOne({
      where: { id },
      relations: {
        buyIns: {
          player: true,
          pix: true,
        },
        cashOuts: {
          player: true,
        },
      },
    });
  }

  async findByCreatedAtBetween(createdAtBetween: BetweenDatesAdapter) {
    return await this.gameRepository.find({
      where: { createdAt: createdAtBetween.adapt() },
      relations: {
        buyIns: {
          player: true,
        },
        cashOuts: {
          player: true,
        },
      },
      order: {
        createdAt: -1,
      },
    });
  }
}
