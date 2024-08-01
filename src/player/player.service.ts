import { Injectable } from '@nestjs/common';
import { CreatePlayerDto } from './dto/create-player.dto';
import { Repository } from 'typeorm';
import { Player } from './entities/player.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
  ) {}

  async create(createPlayerDto: CreatePlayerDto) {
    const player = new Player(createPlayerDto);
    return await this.playerRepository.save(player);
  }

  async findAll() {
    return await this.playerRepository.find();
  }

  async findOne(id: number) {
    return await this.playerRepository.findOne({ where: { id } });
  }

}
