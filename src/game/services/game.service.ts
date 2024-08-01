import { Injectable } from '@nestjs/common';
import { CreateGameDto } from '../dto/create-game.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from '../entities/game.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>
  ) {}

  async create(createGameDto: CreateGameDto) {
    const game = new Game(createGameDto)
    return await this.gameRepository.save(game)
  }

  async findAll() {
    return await this.gameRepository.find()
  }

  async findOne(id: number) {
    return await this.gameRepository.findOne({
      where: { id },
      relations: {
        buyIns: {
          player: true
        },
        cashOuts: {
          player: true
        }
      }
    })
  }

}
